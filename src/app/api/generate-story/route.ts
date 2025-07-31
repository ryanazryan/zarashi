import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Gemini API Key not found. Please ensure the .env.local file is correct and the server has been restarted.");
    return NextResponse.json(
      { error: 'Server configuration incomplete: API Key not found.' },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'The prompt cannot be empty.' }, { status: 400 });
    }
    
    const fullPrompt = `Create an interesting short story based on the following idea: "${prompt}". Tell the story in a flowing and descriptive narrative style.`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ story: text });

  } catch (error: any) {
    console.error('Error calling Google Gemini API:', error);
    return NextResponse.json(
      { error: 'An error occurred while communicating with the AI. Check the server terminal for details.' },
      { status: 500 }
    );
  }
}