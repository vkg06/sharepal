import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export function useWishlist() {
  const [saved, setSaved] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    api.getWishlist()
      .then(ids => { if (active) setSaved(ids); })
      .catch(() => { if (active) setSaved([]); })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  const toggle = async (id) => {
    try {
      const result = await api.toggleWishlist(id);
      setSaved(prev => result.saved ? [...prev, id] : prev.filter(x => x !== id));
    } catch {
      // Keep the existing UI silent on network errors.
    }
  };

  return { saved, toggle, ready };
}
