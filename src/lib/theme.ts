
// Color palette for the application
export const colors = {
  // Primary colors
  primaryBlue: 'hsl(var(--primary))',
  secondaryGreen: 'hsl(var(--secondary))',
  
  // Pastel colors for tab separation
  pastelBlue: '#D3E4FD',
  pastelGreen: '#F2FCE2',
  pastelGray: '#F1F0FB',
  
  // Form validation
  errorRed: '#ffeded',
  errorBorder: '#ea384c',
}

// Helper function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
}
