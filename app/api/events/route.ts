import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sheetId = searchParams.get('sheetId');
  const gid = searchParams.get('gid') || '0';

  // Validate required parameters
  if (!sheetId) {
    return NextResponse.json(
      { error: 'sheetId query parameter is required' },
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

    // Get headers from first line
    const headers = lines[0].split(',').map((h) => h.trim());

    // Parse data rows
    const data = lines
      .slice(1)
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
