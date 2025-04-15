
/**
 * Calcule la surcharge pour le tarif de nuit en fonction des proportions
 * jour/nuit du trajet aller et retour
 */
export const calculateNightSurcharge = (
  oneWayNightProportion: number,
  returnNightProportion: number,
  oneWayDistance: number,
  returnDistance: number,
  basePrice: number,
  nightRatePercentage: number,
  hasReturnTrip: boolean
) => {
  // Calculer les kilomètres de jour et de nuit pour l'aller
  const oneWayDayDistance = oneWayDistance * (1 - oneWayNightProportion);
  const oneWayNightDistance = oneWayDistance * oneWayNightProportion;
  
  // Calculer les prix de base pour l'aller (jour et nuit)
  const oneWayDayPriceHT = oneWayDayDistance * basePrice;
  const oneWayNightPriceHT = oneWayNightDistance * basePrice;
  
  // Calculer la surcharge de nuit pour l'aller
  const oneWayNightSurcharge = oneWayNightPriceHT * (nightRatePercentage / 100);
  
  // Variables pour le retour (initialisées à 0)
  let returnDayDistance = 0;
  let returnNightDistance = 0;
  let returnDayPriceHT = 0;
  let returnNightPriceHT = 0;
  let returnNightSurcharge = 0;
  
  // Si un retour est prévu, calculer les valeurs correspondantes
  if (hasReturnTrip) {
    returnDayDistance = returnDistance * (1 - returnNightProportion);
    returnNightDistance = returnDistance * returnNightProportion;
    
    returnDayPriceHT = returnDayDistance * basePrice;
    returnNightPriceHT = returnNightDistance * basePrice;
    
    returnNightSurcharge = returnNightPriceHT * (nightRatePercentage / 100);
  }
  
  // Calculer la surcharge totale
  const totalNightSurcharge = oneWayNightSurcharge + returnNightSurcharge;
  
  // Calculer les kilomètres totaux
  const totalDayDistance = oneWayDayDistance + returnDayDistance;
  const totalNightDistance = oneWayNightDistance + returnNightDistance;
  const totalDistance = oneWayDistance + (hasReturnTrip ? returnDistance : 0);
  
  // Calculer les prix de jour et de nuit pour le détail
  const dayPrice = totalDayDistance * basePrice;
  // Pour le prix de nuit, on inclut le prix de base + la surcharge
  const nightPrice = (totalNightDistance * basePrice) + totalNightSurcharge;
  
  return {
    nightSurcharge: Math.round(totalNightSurcharge * 100) / 100,
    oneWayDayPriceHT: Math.round(oneWayDayPriceHT * 100) / 100,
    oneWayNightPriceHT: Math.round(oneWayNightPriceHT * 100) / 100,
    returnDayPriceHT: Math.round(returnDayPriceHT * 100) / 100,
    returnNightPriceHT: Math.round(returnNightPriceHT * 100) / 100,
    dayKm: Math.round(totalDayDistance * 100) / 100,
    nightKm: Math.round(totalNightDistance * 100) / 100,
    totalKm: Math.round(totalDistance * 100) / 100,
    dayPrice: Math.round(dayPrice * 100) / 100,
    nightPrice: Math.round(nightPrice * 100) / 100
  };
};
