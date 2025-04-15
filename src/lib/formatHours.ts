
/**
 * Formate un nombre décimal d'heures en une chaîne lisible
 * @param hours Nombre d'heures (peut inclure des décimales)
 * @returns Chaîne formatée (ex: "2h30min")
 */
export const formatHours = (hours: number): string => {
  const fullHours = Math.floor(hours);
  const minutes = Math.round((hours - fullHours) * 60);
  
  if (fullHours === 0) {
    return `${minutes}min`;
  } else if (minutes === 0) {
    return `${fullHours}h`;
  } else {
    return `${fullHours}h${minutes}min`;
  }
};
