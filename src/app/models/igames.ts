export interface Ijackpots {
    game: string;
    amount: number;
}

export interface Igames {
    categories: string[];
    name: string;
    image: string;
    id: string;
    jackpot?: Ijackpots;
}

