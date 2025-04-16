
/**
 * Calcule les heures de jour et de nuit pour un trajet
 */
export const calculateNightHours = (
  hours: number,
  minutes: number,
  estimatedDuration: number,
  nightStartHours: number,
  nightStartMinutes: number,
  nightEndHours: number,
  nightEndMinutes: number
): {
  isNightRateApplied: boolean;
  nightHours: number;
  dayHours: number;
} => {
  let isNightRateApplied = false;
  let nightHours = 0;
  let dayHours = 0;

  const tripStartMinutes = hours * 60 + minutes;
  const tripDurationMinutes = estimatedDuration;
  const tripEndMinutes = (tripStartMinutes + tripDurationMinutes) % (24 * 60);
  
  const nightStartTotalMinutes = nightStartHours * 60 + nightStartMinutes;
  const nightEndTotalMinutes = nightEndHours * 60 + nightEndMinutes;
  
  if (nightStartTotalMinutes > nightEndTotalMinutes) {
    if (tripStartMinutes >= nightStartTotalMinutes) {
      if (tripEndMinutes <= nightEndTotalMinutes) {
        nightHours = tripDurationMinutes / 60;
        isNightRateApplied = true;
      } else if (tripEndMinutes > nightEndTotalMinutes && tripEndMinutes < nightStartTotalMinutes) {
        const nightMinutes = (24 * 60 - tripStartMinutes) + nightEndTotalMinutes;
        nightHours = nightMinutes / 60;
        dayHours = (tripDurationMinutes - nightMinutes) / 60;
        isNightRateApplied = true;
      } else {
        const dayMinutes = nightStartTotalMinutes - nightEndTotalMinutes;
        dayHours = dayMinutes / 60;
        nightHours = (tripDurationMinutes - dayMinutes) / 60;
        isNightRateApplied = true;
      }
    } 
    else if (tripStartMinutes < nightEndTotalMinutes) {
      if (tripEndMinutes <= nightEndTotalMinutes) {
        nightHours = tripDurationMinutes / 60;
        isNightRateApplied = true;
      } else if (tripEndMinutes < nightStartTotalMinutes) {
        const nightMinutes = nightEndTotalMinutes - tripStartMinutes;
        nightHours = nightMinutes / 60;
        dayHours = (tripDurationMinutes - nightMinutes) / 60;
        isNightRateApplied = true;
      } else {
        const dayMinutes = nightStartTotalMinutes - nightEndTotalMinutes;
        dayHours = dayMinutes / 60;
        nightHours = (tripDurationMinutes - dayMinutes) / 60;
        isNightRateApplied = true;
      }
    }
    else if (tripStartMinutes < nightStartTotalMinutes) {
      if (tripEndMinutes >= nightStartTotalMinutes) {
        if (tripEndMinutes <= (24 * 60)) {
          const dayMinutes = nightStartTotalMinutes - tripStartMinutes;
          dayHours = dayMinutes / 60;
          nightHours = (tripDurationMinutes - dayMinutes) / 60;
          isNightRateApplied = true;
        } else {
          const dayMinutes1 = nightStartTotalMinutes - tripStartMinutes;
          const nightMinutes1 = (24 * 60) - nightStartTotalMinutes;
          const nightMinutes2 = tripEndMinutes > nightEndTotalMinutes ? nightEndTotalMinutes : tripEndMinutes;
          dayHours = dayMinutes1 / 60;
          nightHours = (nightMinutes1 + nightMinutes2) / 60;
          isNightRateApplied = true;
        }
      }
    }
  } else {
    if (tripEndMinutes <= nightStartTotalMinutes || tripStartMinutes >= nightEndTotalMinutes) {
      isNightRateApplied = false;
    } else if (tripStartMinutes >= nightStartTotalMinutes && tripEndMinutes <= nightEndTotalMinutes) {
      nightHours = tripDurationMinutes / 60;
      isNightRateApplied = true;
    } else if (tripStartMinutes < nightStartTotalMinutes && tripEndMinutes <= nightEndTotalMinutes) {
      const dayMinutes = nightStartTotalMinutes - tripStartMinutes;
      dayHours = dayMinutes / 60;
      nightHours = (tripDurationMinutes - dayMinutes) / 60;
      isNightRateApplied = true;
    } else if (tripStartMinutes >= nightStartTotalMinutes && tripEndMinutes > nightEndTotalMinutes) {
      const nightMinutes = nightEndTotalMinutes - tripStartMinutes;
      nightHours = nightMinutes / 60;
      dayHours = (tripDurationMinutes - nightMinutes) / 60;
      isNightRateApplied = true;
    } else if (tripStartMinutes < nightStartTotalMinutes && tripEndMinutes > nightEndTotalMinutes) {
      const nightMinutes = nightEndTotalMinutes - nightStartTotalMinutes;
      nightHours = nightMinutes / 60;
      dayHours = (tripDurationMinutes - nightMinutes) / 60;
      isNightRateApplied = true;
    }
  }

  return {
    isNightRateApplied,
    nightHours,
    dayHours
  };
};
