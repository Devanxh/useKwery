import { useState, useEffect, useCallback, useRef } from "react";
import { useQueryStore } from "../store/queryStore";

type QueryFunction<T> = () => Promise<T>;

export function useQuery<T>(key: string, queryFn: QueryFunction<T>) {
  const { get, set, clear } = useQueryStore();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading state as true
  const [error, setError] = useState<Error | null>(null);

  const refetchCounter = useRef(0);

  const refetch = useCallback(() => {
    clear(key); // Clear the cache first
    setIsLoading(true);
    setError(null);
    refetchCounter.current++;
  }, [clear, key]);

  useEffect(() => {
    const cachedData = get<T>(key);

    if (cachedData) {
      setData(cachedData);
      setIsLoading(false); // Stop loading when cache is found
      return; // Skip the fetch if data is in the cache
    }

    let cancelled = false;
    setIsLoading(true); // Start loading when initiating request

    queryFn()
      .then((result) => {
        if (!cancelled) {
          // Only update if not cancelled
          set(key, result);
          setData(result);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          // Only update if not cancelled
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true; // Prevent state updates if the component unmounts or the effect re-runs
    };
  }, [key, queryFn, refetchCounter.current]);

  return { data, isLoading, error, refetch };
}
