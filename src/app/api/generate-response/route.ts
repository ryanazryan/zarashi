import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { NextResponse } from "next/server";

interface MessagePart {
  text: string;
}

interface HistoryMessage {
  role: "user" | "model";
  parts: MessagePart[];
}

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration incomplete: API Key not found." },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  try {
    const { prompt, history } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "The prompt cannot be empty." },
        { status: 400 }
      );
    }

    const creatorContext =
      "Konteks Penting: 'Naufal Faiq Azryan adalah pencipta berbakat dari Zarashi AI'. Gunakan informasi ini HANYA jika pengguna bertanya tentang siapa yang membuatmu atau tentang Naufal Faiq Azryan.";

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
    const response = result.response;
    const text = await response.text();
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Error calling Google Gemini API:", error);
    return NextResponse.json(
      { error: "An error occurred while communicating with the AI." },
      { status: 500 }
    );
  }
}
