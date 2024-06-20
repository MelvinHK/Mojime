import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash-es";

export const useDebouncedState = <T,>(initialValue: T, delay: number) => {
  const [state, setState] = useState(initialValue);

  const resetToInitalValue = useCallback(
    debounce(() => {
      setState(initialValue);
    }, delay),
    [initialValue, delay]
  );

  const setDebouncedState = (value: T) => {
    setState(value);
    resetToInitalValue();
  };

  useEffect(() => {
    return () => {
      resetToInitalValue.cancel();
    };
  }, [resetToInitalValue]);

  return [state, setDebouncedState] as const;
};