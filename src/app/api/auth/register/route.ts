import { NextRequest, NextResponse } from 'next/server';
import { createUserProfile } from '@/lib/database-operations';
import { generateSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, dateOfBirth, gender } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const user = await createUserProfile({
      email,
      password,
      name,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
    });

    const token = await generateSession(user.id);

    const response = NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        verificationStatus: user.verificationStatus,
        accountLevel: user.accountLevel,
      }
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.constraint === 'users_email_unique') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}