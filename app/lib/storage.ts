// LocalStorage helpers
export const storage = {
  get: (key: string) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  set: (key: string, val: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  },
};
