export const runtime = 'nodejs';

import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import { GoogleAIFileManager } from "@google/generative-ai/server";

async function* streamGoogle(stream: AsyncGenerator<any>) {
  for await (const chunk of stream) {
    const text = chunk.text();
    if (text) {
      yield text;
    }
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({
      text: 'Maaf, konfigurasi server belum lengkap. Coba lagi nanti.',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { prompt, history } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({
        text: 'Pertanyaan tidak boleh kosong.',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const creatorContext = "Konteks Penting: 'Naufal Faiq Azryan adalah pencipta berbakat dari Zarashi AI'. Gunakan informasi ini HANYA jika pengguna bertanya tentang siapa yang membuatmu atau tentang Naufal Faiq Azryan.";

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `You are Zarashi AI. ${creatorContext}` }],
        },
        {
          role: "model",
          parts: [{ text: "Tentu, saya Zarashi AI. Siap membantu." }],
        },
        ...(history || []),
      ],
    });

    const result = await chat.sendMessageStream(prompt);
    const stream = streamGoogle(result.stream);

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error: any) {
    console.error('Gemini error:', error);
    return new Response(JSON.stringify({
      text: 'Maaf, sepertinya respons terlalu panjang atau terjadi kendala. Silakan coba ajukan pertanyaan lain yang lebih sederhana.',
    }), {
      status: 200, 
      headers: { 'Content-Type': 'application/json' },
    });
  }
}