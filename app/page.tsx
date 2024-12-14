import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, BarChart3, LogIn, ArrowUp } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const LandingPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    return redirect("/home");
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Track Your Poker Sessions
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Manage buy-ins, track settlements, and analyze your performance with
            our comprehensive poker session management platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Sign Up <ArrowUp className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="text-white">
                Sign In <LogIn className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Session Management
              </h3>
              <p className="text-gray-400">
                Create and manage poker sessions with friends. Track buy-ins and
                rebuys in real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <DollarSign className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Settlement Tracking
              </h3>
              <p className="text-gray-400">
                Automatically calculate who owes what. Make settling up after
                games hassle-free.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <BarChart3 className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Performance Analytics
              </h3>
              <p className="text-gray-400">
                Track your progress with detailed statistics and leaderboards.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Trusted by Poker Players Worldwide
          </h2>
          <div className="flex justify-center gap-8 text-gray-400">
            <div>
              <div className="text-3xl font-bold text-blue-500 mb-2">1000+</div>
              <div>Active Sessions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500 mb-2">
                5000+
              </div>
              <div>Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-2">
                $1M+
              </div>
              <div>Tracked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
