import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt tidak boleh kosong.' }, { status: 400 });
    }
    
    const fullPrompt = `Buat sebuah cerita pendek yang menarik berdasarkan ide berikut: "${prompt}". Ceritakan dengan gaya naratif yang mengalir dan deskriptif.`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ story: text });

  } catch (error: any) {
    console.error('Error in /api/generate-story:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat berkomunikasi dengan AI.' }, { status: 500 });
  }
}