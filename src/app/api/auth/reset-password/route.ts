import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/database-operations';
import { hashPassword } from '@/lib/auth';
import { db } from '@/lib/neon-db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, captcha, newPassword } = await request.json();

    if (!email || !captcha || !newPassword) {
      return NextResponse.json(
        { error: 'Email, captcha và mật khẩu mới là bắt buộc' },
        { status: 400 }
      );
    }

    // Simple captcha validation (demo purposes)
    if (captcha !== '1234') {
      return NextResponse.json(
        { error: 'Invalid captcha code' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update user password
    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ 
      message: 'Mật khẩu đã được đặt lại thành công' 
    });
  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}