import { useCallback, useState } from "react";

/** Generic {id: boolean} toggle map — used for both "show more" on long
 *  posts and "see more comments", so neither needs its own bespoke
 *  state + setter pair. */
export function useToggleMap() {
  const [map, setMap] = useState<Record<string, boolean>>({});

  const toggle = useCallback((key: string) => {
    setMap((state) => ({ ...state, [key]: !state[key] }));
  }, []);

  const isOn = useCallback((key: string) => Boolean(map[key]), [map]);

  return { isOn, toggle };
}
