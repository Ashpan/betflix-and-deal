import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pokerHands = [
  {
    name: "Royal Flush",
    description: "A, K, Q, J, 10, all the same suit",
    example: ["A♠", "K♠", "Q♠", "J♠", "10♠"],
  },
  {
    name: "Straight Flush",
    description: "Five cards in a sequence, all in the same suit",
    example: ["9♥", "8♥", "7♥", "6♥", "5♥"],
  },
  {
    name: "Four of a Kind",
    description: "All four cards of the same rank",
    example: ["Q♠", "Q♥", "Q♦", "Q♣", "5♦"],
  },
  {
    name: "Full House",
    description: "Three of a kind with a pair",
    example: ["J♠", "J♥", "J♦", "8♣", "8♠"],
  },
  {
    name: "Flush",
    description: "Any five cards of the same suit, but not in a sequence",
    example: ["A♣", "J♣", "8♣", "6♣", "2♣"],
  },
  {
    name: "Straight",
    description: "Five cards in a sequence, but not of the same suit",
    example: ["10♠", "9♥", "8♦", "7♣", "6♠"],
  },
  {
    name: "Three of a Kind",
    description: "Three cards of the same rank",
    example: ["8♠", "8♥", "8♦", "K♣", "3♠"],
  },
  {
    name: "Two Pair",
    description: "Two different pairs",
    example: ["A♠", "A♥", "J♦", "J♣", "4♠"],
  },
  {
    name: "Pair",
    description: "Two cards of the same rank",
    example: ["10♠", "10♥", "A♦", "7♣", "2♠"],
  },
  {
    name: "High Card",
    description:
      "When you haven't made any of the hands above, the highest card plays",
    example: ["A♠", "J♥", "8♦", "6♣", "4♠"],
  },
];

const CardIcon = ({ card }: { card: string }) => {
  const [value, suit] = card.split("");
  const suitColor =
    suit === "♥" || suit === "♦" ? "text-red-500" : "text-black";

  return (
    <div className="inline-flex items-center justify-center w-10 h-14 bg-white border border-gray-300 rounded-md shadow-sm mr-1">
      <div className={`text-lg font-bold ${suitColor}`}>
        {value}
        <span className="text-xl">{suit}</span>
      </div>
    </div>
  );
};

export default function PokerHands() {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pokerHands.map((hand) => (
          <Card key={hand.name} className="overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground p-4">
              <CardTitle>{hand.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <p className="text-sm mb-2">{hand.description}</p>
              <div className="flex flex-wrap justify-center">
                {hand.example.map((card, index) => (
                  <CardIcon key={index} card={card} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
