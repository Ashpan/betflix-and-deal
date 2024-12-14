import { BalanceEarningsChart } from "@/app/components/BalanceEarningsChart";
import { BalanceEarningsSummary } from "@/app/components/BalanceEarningsSummary";
import { BalanceGameHistory } from "@/app/components/BalanceGameHistory";
import { IGameHistory } from "@/lib/types/types";
import { createClient } from "@/utils/supabase/server";

const BalancePage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: history, error } = await supabase
    .from("session_participants")
    .select(
      `
      buy_ins,
      final_stack,
      ...sessions!inner (
        id,
        name,
        code,
        created_at,
        ended_at,
        status
      )`,
    )
    .eq("user_id", user?.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .returns<IGameHistory[]>();
  if (error) {
    return console.error("Error fetching game history:", error);
  }
  const totalGames = history.length;
  const totalBuyIns = history.reduce((sum, game) => sum + game.buy_ins, 0);
  const totalCashOuts = history.reduce(
    (sum, game) => sum + (game.final_stack || 0),
    0,
  );
  const profitableGames = history.filter(
    (game) => (game.final_stack || 0) > game.buy_ins,
  ).length;

  const profitHistory = history.map((game) => {
    return {
      ...game,
      profit: (game.final_stack || 0) - game.buy_ins,
    };
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">My Earnings</h1>
      <BalanceEarningsSummary
        totalGames={totalGames}
        totalBuyIns={totalBuyIns}
        totalCashOuts={totalCashOuts}
        profitableGames={profitableGames}
      />
      <BalanceGameHistory history={profitHistory} />
      <BalanceEarningsChart history={history} />
    </div>
  );
};

export default BalancePage;
