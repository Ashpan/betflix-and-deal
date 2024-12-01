const SessionLobby = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  console.log(await params);
  return (
    <div>
      <h1>Session Lobby</h1>
    </div>
  );
};

export default SessionLobby;
