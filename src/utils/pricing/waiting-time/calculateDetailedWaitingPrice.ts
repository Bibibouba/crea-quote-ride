
import { MinuteSplitResult, WaitingTimeCalculationResult } from '@/types/waitingTime';
import { calculateMinuteSplit } from './calculateMinuteSplit';
import { PricingSettings } from '@/types/quoteForm';

export const calculateDetailedWaitingPrice = (
  hasWaitingTime: boolean,
  waitingTimeMinutes: number,
  startDate: Date,
  pricingSettings: PricingSettings,
  waitNightEnabled?: boolean
): WaitingTimeCalculationResult => {
  // Si pas de temps d'attente, retourner des valeurs par défaut
  if (!hasWaitingTime || waitingTimeMinutes <= 0) {
    return {
      dayMinutes: 0,
      nightMinutes: 0,
      waitPriceDay: 0,
      waitPriceNight: 0,
      totalWaitPriceHT: 0,
      waitingVatAmount: 0,
      totalWaitPriceTTC: 0,
      waitEndTime: startDate
    };
  }

  // Prix par minute (à partir du prix par 15 minutes)
  const pricePerMinute = (pricingSettings?.wait_price_per_15min || 7.5) / 15;

  // Vérifier si les tarifs de nuit sont activés
  const enableNightRates = waitNightEnabled || pricingSettings?.wait_night_enabled || false;

  let dayMinutes: number;
  let nightMinutes: number;
  let waitEndTime: Date;

  if (!enableNightRates) {
    // Si pas de tarif de nuit, tout est en tarif jour
    dayMinutes = waitingTimeMinutes;
    nightMinutes = 0;
    waitEndTime = new Date(startDate.getTime() + waitingTimeMinutes * 60000);
  } else {
    // Calculer la répartition jour/nuit
    const minuteSplit: MinuteSplitResult = calculateMinuteSplit(
      startDate,
      waitingTimeMinutes,
      pricingSettings.wait_night_start || '20:00',
      pricingSettings.wait_night_end || '06:00'
    );
    dayMinutes = minuteSplit.dayMinutes;
    nightMinutes = minuteSplit.nightMinutes;
    waitEndTime = minuteSplit.waitEndTime;
  }

  // Calcul des prix HT
  const dayPrice = dayMinutes * pricePerMinute;
  const nightBasePrice = nightMinutes * pricePerMinute;
  const nightPrice = nightBasePrice * (1 + (pricingSettings.wait_night_percentage || 0) / 100);

  // Total HT
  const totalWaitPriceHT = dayPrice + nightPrice;

  // Calcul TVA (20%)
  const vatRate = 0.20;
  const waitingVatAmount = totalWaitPriceHT * vatRate;

  // Total TTC
  const totalWaitPriceTTC = totalWaitPriceHT + waitingVatAmount;

  return {
    dayMinutes,
    nightMinutes,
    waitPriceDay: dayPrice,
    waitPriceNight: nightPrice,
    totalWaitPriceHT,
    waitingVatAmount,
    totalWaitPriceTTC,
    waitEndTime
  };
};
