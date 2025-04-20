
export const isNightTime = (timestamp: Date, nightStartTime: string, nightEndTime: string): boolean => {
  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  
  const [nightStartHours, nightStartMinutes] = nightStartTime.split(':').map(Number);
  const [nightEndHours, nightEndMinutes] = nightEndTime.split(':').map(Number);
  
  const nightStart = nightStartHours * 60 + nightStartMinutes;
  const nightEnd = nightEndHours * 60 + nightEndMinutes;
  
  // If night hours cross midnight
  if (nightStart > nightEnd) {
    return totalMinutes >= nightStart || totalMinutes <= nightEnd;
  } else {
    return totalMinutes >= nightStart && totalMinutes <= nightEnd;
  }
};
