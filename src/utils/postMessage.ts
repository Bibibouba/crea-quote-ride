

export type WidgetEvent = 
  | 'QUOTE_READY' 
  | 'QUOTE_ERROR' 
  | 'STEP_CHANGED';

export type WidgetEventData = {
  QUOTE_READY: { quoteId: string; amount: number; totalTTC?: number };
  QUOTE_ERROR: { message: string; code?: string };
  STEP_CHANGED: { step: number; name: string };
};

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://vtc-zen.com'
];

export function postToParent<T extends WidgetEvent>(
  event: T, 
  data: WidgetEventData[T]
) {
  try {
    const target = window.parent;
    const origin = document.referrer || window.location.origin;
    
    if (target !== window && (
      process.env.NODE_ENV === 'development' || 
      ALLOWED_ORIGINS.some(o => origin.startsWith(o))
    )) {
      target.postMessage({ event, data }, origin);
    }
  } catch (e) {
    console.warn('postToParent failed:', e);
  }
}
