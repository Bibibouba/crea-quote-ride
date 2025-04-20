
import { calculateMinuteSplit } from './waiting-time/calculateMinuteSplit';

export const calculateDetailedWaitingPrice = (
  hasWaitingTime: boolean,
  waitingTimeMinutes: number,
  pricingSettings: any,
  startTime: string,
  date: Date,
  vehicleSettings: any,
  waitNightEnabled?: boolean
) => {
  if (!hasWaitingTime || waitingTimeMinutes <= 0) {
    return {
      waitTimeDay: 0,
      waitTimeNight: 0,
      waitPriceDay: 0,
      waitPriceNight: 0,
      totalWaitPrice: 0,
      waitEndTime: null
    };
  }
  
  console.log('Calculating waiting time price with:', {
    waitingTimeMinutes,
    startTime,
    date: date?.toISOString()
  });
  
  // Determine if night rates are enabled
  const enableNightRates = waitNightEnabled || 
    vehicleSettings?.wait_night_enabled || 
    pricingSettings?.wait_night_enabled || 
    false;
  
  // Calculate wait start time
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const tripDuration = 60; // Estimated trip duration in minutes
  
  const waitStartDate = new Date(date);
  waitStartDate.setHours(startHours, startMinutes + tripDuration, 0, 0);
  
  if (!enableNightRates) {
    // If night rates are disabled, all waiting time is at day rate
    const pricePerMinute = (vehicleSettings?.wait_price_per_15min || pricingSettings?.wait_price_per_15min || 7.5) / 15;
    const totalPrice = waitingTimeMinutes * pricePerMinute;
    
    console.log("Waiting time 100% day rate:", {
      waitingTimeMinutes,
      pricePerMinute,
      totalPrice,
      waitStartDate: waitStartDate.toLocaleTimeString()
    });
    
    return {
      waitTimeDay: waitingTimeMinutes,
      waitTimeNight: 0,
      waitPriceDay: totalPrice,
      waitPriceNight: 0,
      totalWaitPrice: totalPrice,
      waitEndTime: new Date(waitStartDate.getTime() + waitingTimeMinutes * 60000)
    };
  }
  
  // Get night rate settings
  const waitNightStart = vehicleSettings?.wait_night_start || pricingSettings?.wait_night_start || '20:00';
  const waitNightEnd = vehicleSettings?.wait_night_end || pricingSettings?.wait_night_end || '06:00';
  const waitNightPercentage = vehicleSettings?.wait_night_percentage || pricingSettings?.wait_night_percentage || 10;
  
  // Calculate day/night minute split
  const { dayMinutes, nightMinutes, waitEndTime } = calculateMinuteSplit(
    waitStartDate,
    waitingTimeMinutes,
    waitNightStart,
    waitNightEnd
  );
  
  // Calculate prices based on minutes
  const pricePerMinute = (vehicleSettings?.wait_price_per_15min || pricingSettings?.wait_price_per_15min || 7.5) / 15;
  const dayPrice = dayMinutes * pricePerMinute;
  const nightPrice = nightMinutes * pricePerMinute * (1 + (waitNightPercentage / 100));
  const totalPrice = dayPrice + nightPrice;
  
  console.log('Waiting time calculation:', {
    waitingTimeMinutes,
    dayMinutes,
    nightMinutes,
    pricePerMinute,
    dayPrice,
    nightPrice,
    totalPrice,
    enableNightRates,
    waitStartTime: waitStartDate.toLocaleTimeString(),
    waitEndTime: waitEndTime.toLocaleTimeString()
  });
  
  return {
    waitTimeDay: dayMinutes,
    waitTimeNight: nightMinutes,
    waitPriceDay: dayPrice,
    waitPriceNight: nightPrice,
    totalWaitPrice: totalPrice,
    waitEndTime
  };
};

export const calculateWaitingTimePrice = (
  hasWaitingTime: boolean,
  waitingTimeMinutes: number,
  pricingSettings: any,
  time: string,
  date: Date,
  vehicleSettings: any,
  waitNightEnabled?: boolean
): number => {
  const details = calculateDetailedWaitingPrice(
    hasWaitingTime,
    waitingTimeMinutes,
    pricingSettings,
    time,
    date,
    vehicleSettings,
    waitNightEnabled
  );
  
  return details.totalWaitPrice;
};
