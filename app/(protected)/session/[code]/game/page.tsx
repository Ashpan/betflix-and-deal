const SessionLobby = async ({
  params,
}: {
  params: Promise<{ code: string }>;
}) => {
  console.log(await params);
  return (
    <div>
      <h1>Session Game</h1>
    </div>
  );
};

export default SessionLobby;
