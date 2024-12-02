import { getSession } from "@/lib/supabase/queries";

export const SessionCard = async ({
  sessionCode: sessionId,
}: {
  sessionCode: string;
}) => {
  const { data, error } = await getSession(sessionId);
  if (error) {
    console.error(error.message);
    return <h1>{error.message}</h1>;
  }

  return (
    <div>
      <h1>
        Session Name: <b>{data.name}</b>
      </h1>
      <h2>
        Code: <b>{data.code}</b>
      </h2>
      <h2>
        Buy In: <b>${data.buy_in_amount}</b>
      </h2>
    </div>
  );
};
