// ============================================================
// useApi — fetch hook with optional live polling.
// Keeps loading/error/refreshing states consistent across pages.
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";

export function useApi(fetcher, { interval = 0, enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetcherRef = useRef(fetcher);
  const intervalRef = useRef(interval);
  const enabledRef = useRef(enabled);
  const requestIdRef = useRef(0);
  const hasDataRef = useRef(false);

  fetcherRef.current = fetcher;
  intervalRef.current = interval;
  enabledRef.current = enabled;

  const load = useCallback(async ({ silent = false } = {}) => {
    const requestId = ++requestIdRef.current;

    // A re-poll after data exists (or a silent refresh) should
    // never blank the UI into a full loading state.
    if (silent || hasDataRef.current) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await fetcherRef.current();
      if (requestId !== requestIdRef.current) return;
      hasDataRef.current = result.data !== null;
      setData(result.data);
      setMessage(result.message);
      setLastUpdated(new Date());
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setError(loadError.message ?? "Something went wrong");
    } finally {
      if (requestId !== requestIdRef.current) return;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!enabledRef.current) {
      setLoading(false);
      return;
    }

    load();

    const timer =
      intervalRef.current > 0
        ? setInterval(
            () => load({ silent: true }),
            intervalRef.current
          )
        : null;

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [load, interval]);

  const refresh = useCallback(() => load({ silent: true }), [load]);

  return { data, message, error, loading, refreshing, refresh, lastUpdated };
}
