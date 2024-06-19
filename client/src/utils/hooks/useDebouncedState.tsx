import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash-es";

export const useDebouncedState = (initialValue: boolean, delay: number) => {
  const [state, setState] = useState(initialValue);

  const debouncedSetState = useCallback(
    debounce(() => setState(false), delay),
    [delay]
  );

  useEffect(() => {
    if (state) {
      debouncedSetState();
    }
  }, [state, debouncedSetState]);

  return [state, setState] as const;
};
