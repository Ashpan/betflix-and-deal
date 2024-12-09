import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlayCircle,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  // Sample data - replace with actual data from your Supabase database
  const recentSessions = [
    {
      id: 1,
      name: "Friday Night Game",
      date: "2024-12-06",
      status: "completed",
      profit: 120,
    },
    {
      id: 2,
      name: "Sunday Tournament",
      date: "2024-12-08",
      status: "active",
      profit: -50,
    },
  ];

  const pendingSettlements = [
    { id: 1, user: "John Doe", amount: 100 },
    { id: 2, user: "Jane Smith", amount: -75 },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Top Actions */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <Link href="/session">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> New Session
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Sessions
              </CardTitle>
              <PlayCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Profit/Loss
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">+$1,234</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pending Settlements
              </CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Win Rate
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">64%</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions and Settlements */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{session.name}</div>
                      <div className="text-sm text-gray-500">
                        {session.date}
                      </div>
                    </div>
                    <div
                      className={`flex items-center ${session.profit >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {session.profit >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      ${Math.abs(session.profit)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Settlements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingSettlements.map((settlement) => (
                  <div
                    key={settlement.id}
                    className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="font-medium">{settlement.user}</div>
                    <div
                      className={`flex items-center ${settlement.amount >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {settlement.amount >= 0 ? (
                        <>Owes you ${settlement.amount}</>
                      ) : (
                        <>You owe ${Math.abs(settlement.amount)}</>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
