
export default class CurrentRound {
  roundNumber: number;
  goingDown: boolean;

  constructor(roundNumber: number, goingDown: boolean) {
    this.roundNumber = roundNumber;
    this.goingDown = goingDown;
  }

  static fromJSON(json: any): CurrentRound {
    return new CurrentRound(json.roundNumber, json.goingDown);
  }

  getRoundNumber(): number {
    return this.roundNumber;
  }

  getIsGoingDown(): boolean {
    return this.goingDown;
  }
}
  