import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse(
    JSON.stringify({ error: 'Auth not available in static export' }),
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
}

export async function POST() {
  return new NextResponse(
    JSON.stringify({ error: 'Auth not available in static export' }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
}
