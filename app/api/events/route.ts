import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sheetId = searchParams.get('sheetId');
  const gid = searchParams.get('gid') || '0';
  const headerRow = parseInt(
    searchParams.get('headerRow') || '1',
    10
  );

  // Validate required parameters
  if (!sheetId) {
    return NextResponse.json(
      { error: 'sheetId query parameter is required' },
      { status: 400 }
    );
  }

  // Validate headerRow (must be >= 1)
  if (headerRow < 1 || isNaN(headerRow)) {
    return NextResponse.json(
      { error: 'headerRow must be a positive integer' },
      { status: 400 }
    );
  }

  // CSV export URL
  const SHEET_CSV = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  try {
    // Fetch CSV from Google Sheets
    const res = await fetch(SHEET_CSV, { cache: 'no-store' });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch CSV from Google Sheets' },
        { status: res.status }
      );
    }

    const csv = await res.text();

    // Parse CSV
    const lines = csv.trim().split('\n');

    if (lines.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Convert headerRow from 1-indexed to 0-indexed
    const headerRowIndex = headerRow - 1;

    // Check if header row exists
    if (headerRowIndex >= lines.length) {
      return NextResponse.json(
        { error: `Header row ${headerRow} is beyond the CSV length` },
        { status: 400 }
      );
    }

    // Get headers from specified row (convert to 0-indexed)
    const headers = lines[headerRowIndex]
      .split(',')
      .map((h) => h.trim());

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

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
