'use client';

import { useEffect, useState } from 'react';

export type EventData = Record<string, string>;

interface EventsFetcherProps {
  sheetId: string;
  gid?: string; // defaults to '0'
  onDataFetched?: (data: EventData[]) => void; // optional callback
}

export default function EventsFetcher({
  sheetId,
  gid = '0',
  onDataFetched,
}: EventsFetcherProps) {
  const [data, setData] = useState<EventData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Log state changes
  useEffect(() => {
    console.log('[EventsFetcher] Loading state:', loading);
  }, [loading]);

  useEffect(() => {
    if (data) {
      console.log('[EventsFetcher] Data fetched:', data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error('[EventsFetcher] Error state:', error);
    }
  }, [error]);

  useEffect(() => {
    // Fetch events data when component mounts or props change
    const fetchEvents = async () => {
      console.log(
        '[EventsFetcher] Starting fetch for sheetId:',
        sheetId,
        'gid:',
        gid
      );
      setLoading(true);
      setError(null);

      try {
        const url = `/api/events?sheetId=${encodeURIComponent(
          sheetId
        )}&gid=${encodeURIComponent(gid)}`;
        console.log('[EventsFetcher] Fetching from URL:', url);
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.status}`);
        }

        const result = await res.json();
        console.log('[EventsFetcher] API response:', result);

        if (result.error) {
          throw new Error(result.error);
        }

        setData(result.data);
        console.log(
          '[EventsFetcher] Data set successfully, count:',
          result.data?.length || 0
        );

        // Call optional callback if provided
        if (onDataFetched) {
          onDataFetched(result.data);
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('[EventsFetcher] Error caught:', error);
      } finally {
        setLoading(false);
        console.log(
          '[EventsFetcher] Fetch completed, loading set to false'
        );
      }
    };

    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetId, gid]); // onDataFetched intentionally excluded to prevent infinite loops

  // Component doesn't render anything, just handles data fetching
  return null;
}
