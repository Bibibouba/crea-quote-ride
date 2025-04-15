
/**
 * Calcule la majoration pour tarif de nuit
 * 
 * @param basePrice Prix de base avant majoration
 * @param isNightRateEnabled Si le tarif de nuit est activé
 * @param nightKm Kilomètres parcourus pendant les heures de nuit
 * @param totalKm Total des kilomètres parcourus
 * @param nightRatePercentage Pourcentage d'augmentation pour les heures de nuit
 * @returns Montant de la majoration de nuit
 */
export const calculateNightSurcharge = (
  basePrice: number,
  isNightRateEnabled: boolean,
  nightKm: number,
  totalKm: number,
  nightRatePercentage: number
): number => {
  // Si le tarif de nuit n'est pas activé ou si aucun des paramètres n'est valide, retourne 0
  if (!isNightRateEnabled || nightRatePercentage <= 0 || nightKm <= 0 || totalKm <= 0) {
    return 0;
  }

  // Calcule le prix de base pour la portion de nuit
  const nightPortion = nightKm / totalKm;
  const nightBasePrice = basePrice * nightPortion;
  
  // Calcule la majoration en pourcentage du prix de base pour la portion de nuit
  const surcharge = nightBasePrice * (nightRatePercentage / 100);
  
  return Number(surcharge.toFixed(2));
};
