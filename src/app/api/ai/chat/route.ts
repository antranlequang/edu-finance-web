import { NextRequest, NextResponse } from 'next/server';
import { processAIChat } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { history, prompt, eduscore } = body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      );
    }

    // Validate history if provided
    if (history && !Array.isArray(history)) {
      return NextResponse.json(
        { error: 'Invalid history format' },
        { status: 400 }
      );
    }

    // Call the AI service
    const response = await processAIChat({
      history: history || [],
      prompt,
      eduscore
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'AI Chat API is running' },
    { status: 200 }
  );
}