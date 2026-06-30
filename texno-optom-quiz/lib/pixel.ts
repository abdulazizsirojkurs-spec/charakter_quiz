declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const fbq = (event: string, params?: object) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', event, params);
  }
};

export const fbqStandard = (event: string, params?: object) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params);
  }
};
