// General helpers
export function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

import { useState, useEffect } from "react";
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    h();
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return isMobile;
}
