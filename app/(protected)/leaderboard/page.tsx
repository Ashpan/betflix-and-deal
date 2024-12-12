import { LeaderboardTable } from "@/app/components/LeaderboardTable";
import { createClient } from "@/utils/supabase/server";
import { Users } from "lucide-react";

const LeaderboardPage = async () => {
  const supabase = await createClient();
  const { data: leaderboardData, error } = await supabase
    .from("player_stats")
    .select(
      `
            display_name,
            username,
            total_sessions,
            net_profit,
            avg_profit_per_session
            `,
    )
    .order("net_profit", {
      ascending: false,
    });
  if (error) {
    return console.error("Error getting player stats:", error);
  }
  const mergedData = leaderboardData.map((player) => {
    return {
      display_name: player.display_name || player.username,
      total_sessions: player.total_sessions,
      net_profit: player.net_profit,
      avg_profit_per_session: player.avg_profit_per_session,
    };
  });
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Users className="w-6 h-6" /> Player Leaderboard
      </h1>
      <LeaderboardTable leaderboardData={mergedData} />
    </div>
  );
};

export default LeaderboardPage;
