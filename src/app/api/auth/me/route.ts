import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const store = await cookies();
  const session = store.get('session');

  if (!session?.value) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = JSON.parse(session.value);
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
  }
}
