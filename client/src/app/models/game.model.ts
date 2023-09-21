import Profile from "./profile.model";

export default class Game {
  constructor(
    public _id: string = "",
    public players: { white: Profile, black: Profile } = { white: new Profile(), black: new Profile() },
    public gameState: 'ongoing' | 'finished' = 'ongoing',
    public winner: 'white' | 'black' | null = null
  ) {}
}

