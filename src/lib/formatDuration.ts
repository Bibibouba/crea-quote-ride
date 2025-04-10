
/**
 * Convertit une durée en minutes en format heures et minutes
 * @param minutes - Nombre de minutes à convertir
 * @returns Une chaîne formatée (ex: "1h 30min" ou "45min")
 */
export function formatDuration(minutes: number): string {
  if (!minutes && minutes !== 0) return '';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  
  if (hours === 0) {
    return `${remainingMinutes}min`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${remainingMinutes}min`;
  }
}
