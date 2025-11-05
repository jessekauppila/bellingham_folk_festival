import { NextResponse } from 'next/server';
import debug from 'debug';

const log = debug('app:api:events');
const logError = debug('app:api:events:error');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sheetId = searchParams.get('sheetId');
  const gid = searchParams.get('gid') || '0';
  const headerRow = parseInt(
    searchParams.get('headerRow') || '1',
    10
  );

  log(
    'Request received - sheetId:',
    sheetId,
    'gid:',
    gid,
    'headerRow:',
    headerRow
  );

  // Validate required parameters
  if (!sheetId) {
    logError('Missing sheetId parameter');
    return NextResponse.json(
      { error: 'sheetId query parameter is required' },
      { status: 400 }
    );
  }

  // Validate headerRow (must be >= 1)
  if (headerRow < 1 || isNaN(headerRow)) {
    logError('Invalid headerRow:', headerRow);
    return NextResponse.json(
      { error: 'headerRow must be a positive integer' },
      { status: 400 }
    );
  }

  // CSV export URL
  const SHEET_CSV = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  try {
    log('Fetching CSV from Google Sheets:', SHEET_CSV);
    // Fetch CSV from Google Sheets
    const res = await fetch(SHEET_CSV, { cache: 'no-store' });

    if (!res.ok) {
      logError('Failed to fetch CSV, status:', res.status);
      return NextResponse.json(
        { error: 'Failed to fetch CSV from Google Sheets' },
        { status: res.status }
      );
    }

    const csv = await res.text();
    log('CSV fetched successfully, length:', csv.length);

    // Parse CSV
    const lines = csv.trim().split('\n');
    log('CSV parsed into lines:', lines.length);

    if (lines.length === 0) {
      log('No lines found in CSV, returning empty array');
      return NextResponse.json({ data: [] });
    }

    // Convert headerRow from 1-indexed to 0-indexed
    const headerRowIndex = headerRow - 1;

    // Check if header row exists
    if (headerRowIndex >= lines.length) {
      logError(
        'Header row',
        headerRow,
        'is beyond CSV length',
        lines.length
      );
      return NextResponse.json(
        { error: `Header row ${headerRow} is beyond the CSV length` },
        { status: 400 }
      );
    }

    // Get headers from specified row (convert to 0-indexed)
    const headers = lines[headerRowIndex]
      .split(',')
      .map((h) => h.trim());
    log('Headers extracted:', headers);

    // Parse data rows starting from the row after headers
    const data = lines
      .slice(headerRowIndex + 1) // Start from row after headers
      .map((row) => {
        const cols = row.split(',').map((c) => c.trim());
        const obj: Record<string, string> = {};

        headers.forEach((header, index) => {
          obj[header] = cols[index] ?? '';
        });

        return obj;
      })
      // Filter out empty rows (where Event is empty)
      .filter((row) => row['Event'] && row['Event'].trim() !== '');

    log('Data parsed successfully, count:', data.length);
    return NextResponse.json({ data });
  } catch (error) {
    logError('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
