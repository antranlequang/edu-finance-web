import { NextRequest, NextResponse } from 'next/server';
import { processAIChat } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('📨 Chat API received message:', message.substring(0, 100) + '...');
    console.log('📚 History length:', history?.length || 0);

    // Process the AI chat with provided history using server-side AI service
    const response = await processAIChat({
      history: history || [],
      prompt: message,
    });

    console.log('✅ AI response generated, length:', response.length);

    return NextResponse.json({ 
      response
    });

  } catch (error) {
    console.error('❌ Chat API error:', error);
    console.error('Error details:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        response: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật với AI. Vui lòng thử lại sau ít phút. / Sorry, I\'m experiencing technical difficulties with AI service. Please try again in a few minutes.'
      },
      { status: 500 }
    );
  }
}

