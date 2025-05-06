import Player from './Player';
import CurrentRound from './CurrentRound';

function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default class Game {
  id: string;
  name: string | null;
  players: Player[];
  numPlayers: number;
  remainingRounds: CurrentRound[];
  completedRounds: CurrentRound[];
  currentRound: CurrentRound | null;
  midRound: boolean;
  setting_downAndUp: boolean;
  setting_startNumCards: number | null;
  date: Date;
  gameCompleted: boolean;
  dealer: Player | null; // Added dealer variable

  constructor() {
    this.id = generateUniqueId();
    this.name = null;
    this.players = [];
    this.numPlayers = 0;
    this.remainingRounds = [];
    this.completedRounds = [];
    this.currentRound = null;
    this.midRound = false;
    this.setting_downAndUp = false;
    this.setting_startNumCards = null;
    this.date = new Date();
    this.gameCompleted = false;
    this.dealer = null;
  }

  /**
   * Creates a Game instance from a JSON object.
   * @param json The JSON object to create the Game instance from.
   * @returns A new Game instance.
   */
  static fromJSON(json: any): Game {
    const game = new Game();
    game.id = json.id ?? generateUniqueId();
    game.name = json.name ?? null;
    game.players = json.players ? json.players.map((player: any) => Player.fromJSON(player)) : [];
    game.numPlayers = json.numPlayers ?? 0;
    game.remainingRounds = json.remainingRounds ? json.remainingRounds.map((round: any) => CurrentRound.fromJSON(round)) : [];
    game.completedRounds = json.completedRounds ? json.completedRounds.map((round: any) => CurrentRound.fromJSON(round)) : [];
    game.currentRound = json.currentRound ? CurrentRound.fromJSON(json.currentRound) : null;
    game.midRound = json.midRound ?? false;
    game.setting_downAndUp = json.setting_downAndUp ?? false;
    game.setting_startNumCards = json.setting_startNumCards ?? null;
    game.date = json.date ? new Date(json.date) : new Date();
    game.gameCompleted = json.gameCompleted ?? false;
    game.dealer = json.dealer ? Player.fromJSON(json.dealer) : null;
    return game;
  }

  /**
   * Sets the dealer of the game.
   * @param dealer The player to set as the dealer.
   */
  setDealer(dealer: Player): void {
    this.dealer = dealer;
  }

  setDate(date: Date): void {
    this.date = date;
  }

  setName(name: string | null): void {
    this.name = name;
  }

  addPlayer(player: Player): void {
    this.players.push(player);
    this.numPlayers = this.players.length;
  }

  setSettingDownAndUp(setting_downAndUp: boolean): void {
    this.setting_downAndUp = setting_downAndUp;
  }

  setSettingStartNumCards(setting_startNumCards: number): void {
    this.setting_startNumCards = setting_startNumCards;
  }

  setMidRound(midRound: boolean): void {
    this.midRound = midRound;
  }

  addRemainingRound(round: CurrentRound): void {
    this.remainingRounds.push(round);
  }

  completeRound(round: CurrentRound): void {
    this.completedRounds.push(round);
    this.remainingRounds = this.remainingRounds.filter(r => r !== round);
  }
}