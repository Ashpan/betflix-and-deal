export type Player = {
  id: string;
  name: string;
  buyIns: number[];
  cashOuts: number[];
};

export type PokerSession = {
  players: Player[];
  isActive: boolean;
};
