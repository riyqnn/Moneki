// src/app/api/get-models/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: "API Key missing" }, { status: 500 });
  }

  try {
    // CARA BARU: Tembak langsung ke URL API Google (Lebih stabil)
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const availableModels = [];

    // Filter model yang kita butuhkan
    if (data.models) {
      for (const model of data.models) {
        // Kita cari model yang bisa 'generateContent' (bukan model embedding/tuning)
        if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes("generateContent")) {
          availableModels.push({
            // Hapus prefix "models/" biar bersih
            id: model.name.replace("models/", ""), 
            name: model.displayName
          });
        }
      }
    }

    return NextResponse.json({ models: availableModels });

  } catch (error: any) {
    console.error("Gagal fetch list model:", error);
    return
    // FALLBACK / RENCANA CADANGAN
    // Kalau fetch gagal, kita kasih daftar manual biar aplikasi kamu GAK CRASH.
    // return NextResponse.json({ 
    //   models: [
    //     { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (Default)" },
    //     { id: "gemini-1.5-flash-001", name: "Gemini 1.5 Flash 001" },
    //     { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
    //     { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (Experimental)" }
    //   ] 
    // });
  }
}