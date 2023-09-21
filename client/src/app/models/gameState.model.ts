import Game from "./game.model";

export default class GameState {
  constructor(
    public _id: string = '',
    public game: Game = new Game(),
    public currentPlayer: 'white' | 'black' = 'white',
    public board: Array<{ color: 'white' | 'black' | null, amount: number }> = Array(26).fill({ color: null, amount: 0 }),
    public bar: { white: number, black: number } = { white: 0, black: 0 },
    public bearOff: { white: number, black: number } = { white: 0, black: 0 },
    public diceRoll: number[] = [],
    public diceUsed: [boolean, boolean] = [false, false],
  ) {}
}
