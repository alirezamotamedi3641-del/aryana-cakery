import { NextRequest, NextResponse } from 'next/server';

const PREVIEW_PIN = '0000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pin = typeof body?.pin === 'string' ? body.pin.trim() : '';

    if (pin !== PREVIEW_PIN) {
      return NextResponse.json(
        { authorized: false, error: 'Incorrect PIN. Please check and try again.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ authorized: true });
  } catch {
    return NextResponse.json(
      { authorized: false, error: 'Invalid request.' },
      { status: 400 }
    );
  }
}
