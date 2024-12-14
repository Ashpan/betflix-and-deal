import { PaymentsTable } from "@/app/components/PaymentsTable";
import { createClient } from "@/utils/supabase/server";

const PaymentsPage = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("settlements").select(`
      id,
      amount,
      status,
      payee:profiles!settlements_payee_id_fkey(id, display_name, username),
      payer:profiles!settlements_payer_id_fkey(id, display_name, username)
      `);

  return (
    <div>
      <h1>Payments Page</h1>
      <PaymentsTable data={data} />
    </div>
  );
};

export default PaymentsPage;
