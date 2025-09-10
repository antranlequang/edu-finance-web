import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Gemini API connection...');
    
    // Check if API key exists
    const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        status: 'error',
        message: 'No API key found in environment variables',
        checked: ['GOOGLE_GENAI_API_KEY', 'GOOGLE_AI_API_KEY', 'GEMINI_API_KEY']
      });
    }

    // Make a simple test call to Gemini
    const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: 'Hello, can you respond with "Gemini API is working correctly"?' }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 100
        }
      })
    });

    console.log('🧪 Gemini API test response status:', testResponse.status);

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      return NextResponse.json({
        status: 'error',
        message: `Gemini API returned error: ${testResponse.status}`,
        error: errorText
      });
    }

    const data = await testResponse.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({
      status: 'success',
      message: 'Gemini API is working correctly',
      apiKey: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`,
      response: generatedText,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🧪 Test API error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to test Gemini API',
      error: error.message
    });
  }
}