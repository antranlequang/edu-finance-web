import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { getEduscoreByUserId } from '@/lib/database-operations';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const eduscore = await getEduscoreByUserId(user.id);
    return NextResponse.json({ eduscore });
  } catch (error) {
    console.error('Error getting eduscore:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}