
export interface WaitingTimeCalculationResult {
  dayMinutes: number;
  nightMinutes: number;
  waitPriceDay: number;
  waitPriceNight: number;
  totalWaitPriceHT: number;
  waitingVatAmount: number;
  totalWaitPriceTTC: number;
  waitEndTime: Date;
}

export interface MinuteSplitResult {
  dayMinutes: number;
  nightMinutes: number;
  waitEndTime: Date;
}
