import SessionMembers from "./SessionMembers";

const SessionLobby = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  return (
    <div>
      <h1>Session Lobby</h1>
      <SessionMembers sessionId={id} />
    </div>
  );
};

export default SessionLobby;
