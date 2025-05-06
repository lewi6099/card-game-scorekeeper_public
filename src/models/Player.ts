import PlayerRound from './PlayerRound';

// This class keeps track of a specific player and their scores.

export default class Player {
  name: string;
  totalScore: number;
  rounds: PlayerRound[];
  currentRound: PlayerRound | null = null;

  /**
   * Creates an instance of Player.
   * @param name The name of the player.
   */
  constructor(name: string) {
    this.name = name;
    this.totalScore = 0;
    this.rounds = [];
  }
  /**
   * Creates an instance of Player from a JSON object.
   * @param json The JSON object to create the Player from.
   * @returns A new Player instance.
   */
  static fromJSON(json: any): Player {
    const player = new Player(json.name);
    player.totalScore = json.totalScore;
    player.rounds = json.rounds.map((round: any) => PlayerRound.fromJSON(round));
    player.currentRound = json.currentRound ? PlayerRound.fromJSON(json.currentRound) : null;
    return player;
  }
}