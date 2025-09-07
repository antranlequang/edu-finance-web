import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { createVerificationDocument } from '@/lib/database-operations';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('type') as string;

    if (!file || !documentType) {
      return NextResponse.json(
        { error: 'File and document type are required' },
        { status: 400 }
      );
    }

    // For demo purposes, we'll just store a placeholder URL
    // In production, you would upload to cloud storage (Cloudinary, S3, etc.)
    const fileUrl = `https://demo-storage.example.com/docs/${Date.now()}-${file.name}`;

    const documentId = await createVerificationDocument({
      userId: user.id,
      type: documentType,
      name: file.name,
      fileUrl: fileUrl,
    });

    return NextResponse.json({ 
      message: 'Document uploaded successfully',
      documentId 
    });
  } catch (error: any) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}