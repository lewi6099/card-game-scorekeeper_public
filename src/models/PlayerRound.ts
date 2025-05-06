
export default class PlayerRound {
  roundNumber: number;
  goingDown: boolean;
  bidAmount: number | null;
  actualAmount: number | null;
  roundScore: number | null;

  /**
   * Creates an instance of Chip.
   * @param title The title of the chip.
   * @param type The type of the chip ('good' or 'bad').
   * @param holder The holder of the chip (nullable).
   */
  constructor(roundNumber: number, goingDown: boolean) {
    this.roundNumber = roundNumber;
    this.goingDown = goingDown;
    this.bidAmount = null;
    this.actualAmount = null;
    this.roundScore = null;
  }

  /**
   * Creates an instance of PlayerRound from a JSON object.
   * @param json The JSON object to create the instance from.
   * @returns A new instance of PlayerRound.
   */
  static fromJSON(json: any): PlayerRound {
    const playerRound = new PlayerRound(json.roundNumber, json.goingDown);
    playerRound.bidAmount = json.bidAmount;
    playerRound.actualAmount = json.actualAmount;
    playerRound.roundScore = json.roundScore;
    return playerRound;
  }

  calculateRoundScore = () => {
    if(this.bidAmount != null && this.actualAmount != null) {
      if(this.bidAmount == this.actualAmount) {
        this.roundScore = 10 + this.actualAmount;
      } else {
        this.roundScore = this.actualAmount;
      }
    }
  }

}