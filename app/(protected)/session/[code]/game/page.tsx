"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PokerSession, Player } from "@/lib/types/poker";
import PlayerManagement from "@/app/components/GamePlayerManagement";
import SessionStatus from "@/app/components/GameSessionStatus";
import PokerHandsCheatSheet from "@/app/components/GamePokerHands";
import EndSession from "@/app/components/GameEndSession";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AddMemberCombobox } from "@/app/components/AddMemberCombobox";

export default function PokerSessionPage() {
  const [session, setSession] = useState<PokerSession>({
    players: [],
    isActive: true,
  });

  const addPlayer = (name: string, buyIn: number) => {
    const newPlayer: Player = {
      id: uuidv4(),
      name,
      buyIns: [buyIn],
      cashOuts: [],
    };
    setSession((prev) => ({
      ...prev,
      players: [...prev.players, newPlayer],
    }));
  };

  const addBuyIn = (playerId: string, amount: number) => {
    setSession((prev) => ({
      ...prev,
      players: prev.players.map((player) =>
        player.id === playerId
          ? { ...player, buyIns: [...player.buyIns, amount] }
          : player,
      ),
    }));
  };

  const cashOutPlayer = (playerId: string, amount: number) => {
    setSession((prev) => ({
      ...prev,
      players: prev.players.map((player) =>
        player.id === playerId
          ? { ...player, cashOuts: [...player.cashOuts, amount] }
          : player,
      ),
    }));
  };

  const endSession = (finalCashOuts: { [playerId: string]: number }) => {
    setSession((prev) => ({
      ...prev,
      isActive: false,
      players: prev.players.map((player) => ({
        ...player,
        cashOuts: [...player.cashOuts, finalCashOuts[player.id] || 0],
      })),
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Poker Session Tracker</h1>
      {session.isActive ? (
        <>
          <Accordion
            type="multiple"
            defaultValue={[
              "player-management",
              "session-status",
              "poker-hands",
            ]}
            className="w-full mb-8"
          >
            <AccordionItem value="player-management">
              <AccordionTrigger>Player Management</AccordionTrigger>
              <AccordionContent>
                {/* <PlayerManagement
                  players={session.players}
                  onAddPlayer={addPlayer}
                  onAddBuyIn={addBuyIn}
                  onCashOut={cashOutPlayer}
                /> */}
                <AddMemberCombobox members={[]} sessionCode="AAAAA" />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="session-status">
              <AccordionTrigger>Session Status</AccordionTrigger>
              <AccordionContent>
                <SessionStatus players={session.players} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="poker-hands">
              <AccordionTrigger>Poker Hands Cheat Sheet</AccordionTrigger>
              <AccordionContent>
                <PokerHandsCheatSheet />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-8 text-center">
            <EndSession players={session.players} onEndSession={endSession} />
          </div>
        </>
      ) : (
        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-2">Session Ended</h2>
          <SessionStatus players={session.players} />
        </div>
      )}
    </div>
  );
}
