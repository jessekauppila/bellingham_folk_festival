'use client';

import { useEffect, useState } from 'react';
import debug from '../../lib/debug';

const log = debug('app:events');
const logError = debug('app:events:error');

export type EventData = Record<string, string>;

interface EventsFetcherProps {
  sheetId: string;
  gid?: string; // defaults to '0'
  headerRow?: number; // defaults to 1 (1-indexed row number)
  onDataFetched?: (data: EventData[]) => void; // optional callback
}

export default function EventsFetcher({
  sheetId,
  gid = '0',
  headerRow = 1,
  onDataFetched,
}: EventsFetcherProps) {
  const [data, setData] = useState<EventData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Log state changes
  useEffect(() => {
    log('Loading state:', loading);
  }, [loading]);

  useEffect(() => {
    if (data) {
      log('Data fetched:', data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      logError('Error state:', error);
    }
  }, [error]);

  useEffect(() => {
    // Fetch events data when component mounts or props change
    const fetchEvents = async () => {
      log(
        'Starting fetch for sheetId:',
        sheetId,
        'gid:',
        gid,
        'headerRow:',
        headerRow
      );
      setLoading(true);
      setError(null);

      try {
        const url = `/api/events?sheetId=${encodeURIComponent(
          sheetId
        )}&gid=${encodeURIComponent(gid)}&headerRow=${headerRow}`;
        log('Fetching from URL:', url);
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.status}`);
        }

        const result = await res.json();
        log('API response:', result);

        if (result.error) {
          throw new Error(result.error);
        }

        setData(result.data);
        log(
          'Data set successfully, count:',
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
        logError('Error caught:', error);
      } finally {
        setLoading(false);
        log('Fetch completed, loading set to false');
      }
    };

    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetId, gid, headerRow]); // Add headerRow to dependencies

  // Component doesn't render anything, just handles data fetching
  return null;
}
