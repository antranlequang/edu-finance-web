import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateSession } from '@/lib/auth';
import { getUserByEmail, getUserForLogin } from '@/lib/database-operations';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    // Check for default admin account
    if (email === 'admin@hyhan.vn' && password === 'admin123') {
      const defaultAdmin = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin@hyhan.vn',
        name: 'Admin',
        role: 'admin' as const,
        dateOfBirth: null,
        gender: null,
        verificationStatus: 'verified' as const,
        accountLevel: 999,
      };

      // Create a special admin token without database session
      const adminToken = 'admin-session-token';

      const response = NextResponse.json({ 
        user: defaultAdmin
      });

      response.cookies.set('auth-token', adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }

    // For non-admin accounts, continue with database lookup
    const userCreds = await getUserForLogin(email);
    if (!userCreds) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, userCreds.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get full user profile
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Generate session
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
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}