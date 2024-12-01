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
    initial_buy_in decimal not null,
    final_stack decimal,
    status text check (status in ('invited', 'accepted', 'declined', 'completed')) default 'invited',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(session_id, user_id)
);

-- Buy-ins tracking (for rebuys during session)
create table public.buy_ins (
    id uuid primary key default gen_random_uuid(),
    session_id uuid references public.sessions(id) not null,
    user_id uuid references public.profiles(id) not null,
    amount decimal not null,
    created_at timestamp with time zone default now()
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
    sum(sp.final_stack - sp.initial_buy_in) as net_profit,
    avg(sp.final_stack - sp.initial_buy_in) as avg_profit_per_session
from profiles p
left join session_participants sp on p.id = sp.user_id
where sp.status = 'completed'
group by p.id, p.display_name;

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.session_participants enable row level security;
alter table public.buy_ins enable row level security;
alter table public.settlements enable row level security;

-- Example RLS policies (you'll need to adjust these based on your requirements)
create policy "Public profiles are visible to all"
    on public.profiles for select
    using (true);

create policy "Users can insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

create policy "Users can create new sessions"
    on public.sessions for insert
    with check (auth.uid() = created_by);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Users can view sessions they're part of"
    on public.sessions for select
    using (
        auth.uid() in (
            select user_id
            from public.session_participants
            where session_id = id
        )
    );


-- Function to handle user creation
create function public.handle_new_user()
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
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();


-- Function to add session created_by to session_participants
create function public.handle_new_session()
returns trigger as $$
begin
    insert into public.session_participants (session_id, user_id, initial_buy_in, status)
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
create trigger on_session_created
    after insert on public.sessions
    for each row execute procedure public.handle_new_session();


-- Triggers for updating timestamps
create function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at
    before update on public.profiles
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_session_participants_updated_at
    before update on public.session_participants
    for each row
    execute procedure public.handle_updated_at();