import { NextResponse } from 'next/server';

export const dynamic = 'auto';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json([], {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST() {
  return new NextResponse(
    JSON.stringify({ error: 'Method not allowed in static export' }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
}
