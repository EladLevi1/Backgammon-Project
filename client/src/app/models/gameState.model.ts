import Stack from "./stack.model";

export default class GameState{
    constructor(public stacks: Stack[], public eaten: any, public out: any, public turnOf: string, public firstDie: number, public  secondDie: number, public lastDice: number[]){}

    static init(gameState: any): GameState {
        console.log(gameState.stacks);
        const stacks = gameState.stacks.map((stack: any) => new Stack(stack.occupied, stack.amount));
        const eaten = gameState.eaten;
        const out = gameState.out;
        const firstDie = gameState.firstDie;
        const secondDie = gameState.secondDie;
        const turnOf = gameState.turnOf;
        const lastDice = gameState.lastDice;

        return new GameState(stacks, eaten, out, turnOf, firstDie, secondDie, lastDice);
      }
}