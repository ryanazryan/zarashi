export const runtime = 'nodejs';

import { GoogleGenerativeAI, Content } from '@google/generative-ai';

interface MessagePart {
  text: string;
}

interface HistoryMessage {
  role: 'user' | 'model';
  parts: MessagePart[];
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
      ] as Content[],
    });

    const result = await chat.sendMessage(prompt);
    const text = result.response.text || 'Maaf, saya tidak bisa menjawab saat ini.';

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Gemini error:', error);
    return new Response(JSON.stringify({
      text: 'Terjadi kesalahan saat menghubungi AI. Silakan coba lagi nanti.',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
