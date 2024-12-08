create schema if not exists public;
grant usage on schema "public" to anon;
grant usage on schema "public" to authenticated;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA "public" TO authenticated;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA "public" TO anon;


-- Users table (extends Supabase auth.users)
create table public.profiles (
    id uuid references auth.users(id) primary key,
    username text unique not null,
    display_name text,
    email text unique not null,
    avatar_url text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Sessions/Games table
create table public.sessions (
    id uuid primary key default gen_random_uuid(),
    code text unique not null,
    name text,
    created_by uuid references public.profiles(id) not null,
    status text check (status in ('pending', 'active', 'completed', 'cancelled')) default 'pending',
    buy_in_amount decimal not null,
    created_at timestamp with time zone default now(),
    ended_at timestamp with time zone,
    notes text
);

-- Session participants
create table public.session_participants (
    id uuid primary key default gen_random_uuid(),
    session_id uuid references public.sessions(id) not null,
    user_id uuid references public.profiles(id) not null,
    buy_ins decimal not null,
    final_stack decimal,
    status text check (status in ('invited', 'accepted', 'declined', 'completed')) default 'invited',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(session_id, user_id)
);

-- Settlements table (for tracking who owes who)
create table public.settlements (
    id uuid primary key default gen_random_uuid(),
    session_id uuid references public.sessions(id) not null,
    payer_id uuid references public.profiles(id) not null,
    payee_id uuid references public.profiles(id) not null,
    amount decimal not null,
    status text check (status in ('pending', 'completed')) default 'pending',
    created_at timestamp with time zone default now(),
    settled_at timestamp with time zone,
    unique(session_id, payer_id, payee_id)
);

-- Create views for leaderboard
create view public.player_stats as
select
    p.id as user_id,
    p.display_name,
    count(distinct sp.session_id) as total_sessions,
    sum(sp.final_stack - sp.buy_ins) as net_profit,
    avg(sp.final_stack - sp.buy_ins) as avg_profit_per_session
from profiles p
left join session_participants sp on p.id = sp.user_id
where sp.status = 'completed'
group by p.id, p.display_name;

-- Create buckets
insert into storage.buckets
  (id, name, public)
values
  ('avatars', 'avatars', true);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.session_participants enable row level security;
alter table public.session_participants replica identity full;
alter table public.settlements enable row level security;

-- RLS policies

-- Policy to allow public profiles to be visible to all
create policy "Public profiles are visible to all"
    on public.profiles for select
    using (true);

-- Policy to allow users to insert their own profile
create policy "Users can insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

-- Policy to allow users to create new sessions
create policy "Users can create new sessions"
    on public.sessions for insert
    with check (auth.uid() = created_by);

-- Policy to allow users to update their own profile
create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

-- Policy to allow users to view sessions they're part of or pending sessions
create policy "Users can view sessions they're part of or by code"
    on public.sessions for select
    using (
        ((auth.uid() IN ( SELECT session_participants.user_id
        FROM session_participants
        WHERE (session_participants.session_id = sessions.id))) OR (status = 'pending'::text))
    );

-- Policy for session owners to update their own sessions
create policy "Session owners can update their own sessions"
    on public.sessions for update
    using (auth.uid() = created_by);

-- Policy to allow users to view session participants
create policy "Can view session participants"
    on public.session_participants for select
    using (true);

-- Policy to allow users to join pending sessions
create policy "Users can join sessions"
    on public.session_participants for insert
    with check (
        user_id = auth.uid()
        AND
        exists (
            select 1
            from public.sessions s
            where s.id = session_id
            and s.status = 'pending'
        )
    );

-- Policy to allow users to update their own participation
create policy "Users can update own participation"
    on public.session_participants for update
    using (user_id = auth.uid());

-- Policy to allow session owners to update session participants
create policy "Session owners can update participants"
    on public.session_participants for update
    using (
        auth.uid() in (
            select created_by
            from public.sessions
            where id = session_id
        )
    );

-- Policy to allow users to leave a session
create policy "Users can delete own participation"
    on public.session_participants for delete
    using (user_id = auth.uid());

create policy "Authenicated user can upload avatar"
on storage.objects for insert to authenticated with check (
    bucket_id = 'avatars'
);

create policy "User can update their own avatar"
    on storage.objects for update to authenticated
    using ( (select auth.uid()) = owner_id::uuid );

create policy "Anyone can access avatars"
  on storage.objects for select to authenticated
  using ( bucket_id = 'avatars' );


-- Enable realtime
alter
  publication supabase_realtime add table public.session_participants;

alter
  publication supabase_realtime add table public.profiles;

-- Function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, username, email)
    values (
        new.id,
        new.email,
        new.email
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to handle user creation
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();


-- Function to add session created_by to session_participants
create or replace function public.handle_new_session()
returns trigger as $$
begin
    insert into public.session_participants (session_id, user_id, buy_ins, status)
    values (
        new.id,
        new.created_by,
        new.buy_in_amount,
        'accepted'
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to add session created_by to session_participants
create or replace trigger on_session_created
    after insert on public.sessions
    for each row execute procedure public.handle_new_session();


-- Triggers for updating timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create or replace trigger handle_profiles_updated_at
    before update on public.profiles
    for each row
    execute procedure public.handle_updated_at();

create or replace trigger handle_session_participants_updated_at
    before update on public.session_participants
    for each row
    execute procedure public.handle_updated_at();

-- Function to allow a user to join a session
create or replace function join_session(p_session_code text)
returns json
language plpgsql
security definer
as $$
declare
    v_session_id uuid;
    v_session_buy_in decimal;
    v_user_id uuid;
    v_participant json;
begin
    -- Get the current user's ID
    v_user_id := auth.uid();

    -- Get the session ID
    select id, buy_in_amount into v_session_id, v_session_buy_in
    from public.sessions
    where code = p_session_code and status = 'pending';

    if v_session_id is null then
        raise exception 'Session not found or not pending';
    end if;

    -- Check if user is already in session
    if exists (
        select 1
        from public.session_participants
        where session_id = v_session_id and user_id = v_user_id
    ) then
        raise exception 'User already in session';
    end if;

    -- Insert the participant
    insert into public.session_participants (
        session_id,
        user_id,
        buy_ins,
        status
    )
    values (
        v_session_id,
        v_user_id,
        v_session_buy_in,
        'accepted'
    )
    returning json_build_object(
        'session_id', session_id,
        'user_id', user_id,
        'buy_ins', buy_ins,
        'status', status
    ) into v_participant;

    return v_participant;
end;
$$;

-- Function to allow a user to leave a session
create or replace function leave_session(p_session_code text)
returns boolean
language plpgsql
security definer
as $$
declare
    v_session_id uuid;
    v_user_id uuid;
    v_is_owner boolean;
    v_participant_count integer;
    v_new_owner_id uuid;
begin
    -- Get the current user's ID
    v_user_id := auth.uid();

    -- Get the session ID
    select id into v_session_id
    from public.sessions
    where code = p_session_code and status = 'pending';

    if v_session_id is null then
        raise exception 'Session not found or not pending';
    end if;

    select (created_by = v_user_id) into v_is_owner
    from public.sessions
    where id = v_session_id;

    -- Check if user is not in session
    if not exists (
        select 1
        from public.session_participants
        where session_id = v_session_id and user_id = v_user_id
    ) then
        raise exception 'User not in session';
    end if;

    -- If user is owner, handle ownership transfer or cancel session
    if v_is_owner then
        select count(*) into v_participant_count
        from public.session_participants
        where session_id = v_session_id
        and user_id != v_user_id;

        if v_participant_count = 0 then
            -- Cancel the session
            update public.sessions
            set status = 'cancelled'
            where id = v_session_id;
        else
            -- Transfer ownership to another participant
            select user_id into v_new_owner_id
            from public.session_participants
            where session_id = v_session_id
            and user_id != v_user_id
            and status = 'accepted'
            order by created_at asc
            limit 1;

            if v_new_owner_id is not null then
                update public.sessions
                set created_by = v_new_owner_id
                where id = v_session_id;
            else
                update public.sessions
                set status = 'cancelled'
                where id = v_session_id;
            end if;
        end if;
    end if;

    -- Delete the participant
    delete from public.session_participants
    where session_id = v_session_id and user_id = v_user_id;

    return true;
end;
$$;

create or replace function get_session_participants(p_session_code text)
returns json
language plpgsql
security definer
as $$
declare
    v_session_id uuid;
    v_participants json;
begin
    -- Get the session ID
    select id into v_session_id
    from public.sessions
    where code = p_session_code;

    if v_session_id is null then
        raise exception 'Session not found';
    end if;

    -- Get the participants
    select json_agg(json_build_object(
        'id', p.id,
        'sp_id', sp.id,
        'username', p.username,
        'display_name', p.display_name,
        'email', p.email,
        'avatar_url', p.avatar_url,
        'buy_ins', sp.buy_ins,
        'final_stack', sp.final_stack,
        'status', sp.status,
        'is_owner', sp.user_id = s.created_by
    )) into v_participants
    from public.session_participants sp
    inner join public.profiles p on p.id = user_id
    inner join public.sessions s on s.id = session_id
    where session_id = v_session_id;

    return v_participants;
end;
$$;

create or replace function get_session_member(p_user_id uuid, p_session_code text)
returns json
language plpgsql
security definer
as $$
declare
    v_session_id uuid;
    v_member json;
begin
    -- Get the session ID
    select id into v_session_id
    from public.sessions
    where code = p_session_code;

    if v_session_id is null then
        raise exception 'Session not found';
    end if;

    -- Get the member

    select json_build_object(
        'id', p.id,
        'sp_id', sp.id,
        'username', p.username,
        'display_name', p.display_name,
        'email', p.email,
        'avatar_url', p.avatar_url,
        'buy_ins', sp.buy_ins,
        'final_stack', sp.final_stack,
        'status', sp.status,
        'is_owner', sp.user_id = s.created_by
    ) into v_member
    from public.sessions s
    inner join public.session_participants sp on s.id = sp.session_id
    inner join public.profiles p on sp.user_id = p.id
    where s.code = p_session_code and p.id = p_user_id;

    return v_member;
end;
$$;

create or replace function add_member_to_session(p_session_code text, p_user_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
    v_session_id uuid;
    v_session_buy_in decimal;
    v_participant json;
begin
    -- Get the session ID
    select id, buy_in_amount into v_session_id, v_session_buy_in
    from public.sessions
    where code = p_session_code and (status = 'pending' or status = 'active');

    if v_session_id is null then
        raise exception 'Session not found or not in lobby';
    end if;

    -- Check if user is already in session
    if exists (
        select 1
        from public.session_participants
        where session_id = v_session_id and user_id = p_user_id
    ) then
        raise exception 'User already in session';
    end if;

    -- Insert the participant
    insert into public.session_participants (
        session_id,
        user_id,
        buy_ins,
        status
    )
    values (
        v_session_id,
        p_user_id,
        v_session_buy_in,
        'accepted'
    );

    return true;
end;
$$;

create or replace function delete_member_from_session(p_session_code text, p_user_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
    v_session_id uuid;
begin
    -- Get the session ID
    select id into v_session_id
    from public.sessions
    where code = p_session_code and status = 'pending';

    if v_session_id is null then
        raise exception 'Session not found or not in lobby';
    end if;

    -- DELETE the participant
    delete from public.session_participants
    where session_id = v_session_id AND user_id = p_user_id;

    return true;
end;
$$;
