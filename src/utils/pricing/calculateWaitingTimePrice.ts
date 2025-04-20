
/**
 * Calcule le prix du temps d'attente en tenant compte des tarifs de jour et de nuit
 */
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
      totalWaitPrice: 0
    };
  }
  
  // Déterminer si la majoration de nuit est activée
  const enableNightRates = waitNightEnabled || vehicleSettings?.wait_night_enabled || pricingSettings?.wait_night_enabled || false;
  
  if (!enableNightRates) {
    // Si pas de majoration de nuit, tout le temps d'attente est au tarif de jour
    const pricePerMinute = (vehicleSettings?.wait_price_per_15min || pricingSettings?.wait_price_per_15min || 7.5) / 15;
    const totalPrice = waitingTimeMinutes * pricePerMinute;
    
    console.log("Waiting time 100% day rate:", {
      waitingTimeMinutes,
      pricePerMinute,
      totalPrice
    });
    
    return {
      waitTimeDay: waitingTimeMinutes,
      waitTimeNight: 0,
      waitPriceDay: totalPrice,
      waitPriceNight: 0,
      totalWaitPrice: totalPrice
    };
  }
  
  // Récupérer les paramètres de tarif de nuit
  const waitNightStart = vehicleSettings?.wait_night_start || pricingSettings?.wait_night_start || '20:00';
  const waitNightEnd = vehicleSettings?.wait_night_end || pricingSettings?.wait_night_end || '06:00';
  const waitNightPercentage = vehicleSettings?.wait_night_percentage || pricingSettings?.wait_night_percentage || 10;
  
  // Calculer l'heure de début d'attente (après l'arrivée)
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const tripDuration = 60; // Durée estimée du trajet (en minutes) - corrigé à 60 minutes fixes
  
  const waitStartDate = new Date(date);
  waitStartDate.setHours(startHours, startMinutes + tripDuration, 0, 0);
  
  // Créer des objets Date pour le début et la fin de la nuit
  const nightStartHours = parseInt(waitNightStart.split(':')[0]);
  const nightStartMinutes = parseInt(waitNightStart.split(':')[1]);
  const nightEndHours = parseInt(waitNightEnd.split(':')[0]);
  const nightEndMinutes = parseInt(waitNightEnd.split(':')[1]);
  
  const nightStartDate = new Date(date);
  nightStartDate.setHours(nightStartHours, nightStartMinutes, 0, 0);
  
  const nightEndDate = new Date(date);
  nightEndDate.setHours(nightEndHours, nightEndMinutes, 0, 0);
  
  // Si la fin de nuit est avant le début, cela signifie qu'elle est le jour suivant
  if (nightEndDate <= nightStartDate) {
    nightEndDate.setDate(nightEndDate.getDate() + 1);
  }
  
  // Calculer la répartition des minutes d'attente entre jour et nuit
  let dayMinutes = 0;
  let nightMinutes = 0;
  
  // Vérifier minute par minute pour plus de précision
  for (let i = 0; i < waitingTimeMinutes; i++) {
    const currentMinute = new Date(waitStartDate.getTime() + i * 60000);
    let isNight = false;
    
    if (nightEndDate > nightStartDate) {
      // Cas simple : nuit dans la même journée
      isNight = currentMinute >= nightStartDate && currentMinute < nightEndDate;
    } else {
      // Cas où la nuit chevauche minuit
      const currentHour = currentMinute.getHours();
      const currentMin = currentMinute.getMinutes();
      const totalCurrentMinutes = currentHour * 60 + currentMin;
      const totalNightStartMinutes = nightStartHours * 60 + nightStartMinutes;
      const totalNightEndMinutes = nightEndHours * 60 + nightEndMinutes;
      
      isNight = totalCurrentMinutes >= totalNightStartMinutes || totalCurrentMinutes < totalNightEndMinutes;
    }
    
    if (isNight) {
      nightMinutes++;
    } else {
      dayMinutes++;
    }
  }
  
  // Forcer à 100% jour si waitNightEnabled est désactivé
  if (!enableNightRates) {
    dayMinutes = waitingTimeMinutes;
    nightMinutes = 0;
  }
  
  // Calculer les prix en fonction des minutes
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
    enableNightRates
  });
  
  return {
    waitTimeDay: dayMinutes,
    waitTimeNight: nightMinutes,
    waitPriceDay: dayPrice,
    waitPriceNight: nightPrice,
    totalWaitPrice: totalPrice
  };
};

/**
 * Version simplifiée pour le calcul du prix d'attente (compatibilité ancienne)
 */
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
