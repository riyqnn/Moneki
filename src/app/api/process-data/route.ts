import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

// Setup Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    // 1. Terima Data (termasuk pilihan model)
    const body = await request.json();
    // Ambil 'modelType' dari body, kalau kosong default ke 'gemini-1.5-flash'
    const { nama, catatanAgen, imageBase64Aset, imageBase64Logbook, modelType } = body;
    
    const selectedModel = modelType || "gemini-1.5-flash"; // Fallback default
    console.log("🤖 Menggunakan Model:", selectedModel);

    // 2. Siapkan Model sesuai pilihan user
    const model = genAI.getGenerativeModel({ model: selectedModel });
    
    const prompt = `
      Kamu adalah sistem scoring kredit bernama Moniq AI.
      Saya kirimkan:
      1. Gambar Aset Usaha.
      2. Gambar Logbook Keuangan.
      3. Catatan Agen: "${catatanAgen}".

      Tugasmu:
      1. Analisis Aset (C1): Lihat kerapian dan stok barang (Skor 1-10).
      2. Analisis Karakter (C2): Lihat sentimen catatan agen (Skor 1-10).
      3. Analisis Kapasitas (C3): Baca angka di logbook, estimasi kesehatan omzet (Skor 1-10).

      Output WAJIB JSON murni tanpa format markdown:
      {
        "analisis_aset": "penjelasan singkat...",
        "c1": 0,
        "analisis_karakter": "penjelasan singkat...",
        "c2": 0,
        "analisis_kapasitas": "penjelasan singkat (sebutkan angka omzet)...",
        "c3": 0
      }
    `;

    // Bersihkan string Base64 (buang header "data:image/...")
    const cleanAset = imageBase64Aset.split(',')[1] || imageBase64Aset;
    const cleanLogbook = imageBase64Logbook.split(',')[1] || imageBase64Logbook;

    // 3. Kirim ke Gemini
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: cleanAset, mimeType: "image/jpeg" } },
      { inlineData: { data: cleanLogbook, mimeType: "image/jpeg" } }
    ]);

    const responseText = result.response.text();
    const jsonString = responseText.replace(/```json|```/g, "").trim();
    const aiData = JSON.parse(jsonString);

    // 4. Hitung WASPAS (SPK)
    const w1 = 0.3, w2 = 0.3, w3 = 0.4; // konfigurasi bobot setiap skor dari c1-c3

    const { c1, c2, c3 } = aiData;

    // Hitung WSM
    const Q1 = (c1 * w1) + (c2 * w2) + (c3 * w3);

    // Hitung WPM
    const Q2 = Math.pow(c1, w1) * Math.pow(c2, w2) * Math.pow(c3, w3);

    // Gabungan WSM dan WPM
    const Qi = (0.5 * Q1) + (0.5 * Q2);

    // Keputusan sementara dari skoring AI
    const statusKeputusan = Qi >= 6.0 ? "APPROVED" : "REJECTED";

    // 5. Simpan ke Firestore
    const docRef = await addDoc(collection(db, "loan_applications"), {
      nama_nasabah: nama,
      createdAt: Timestamp.now(),
      model_used: selectedModel,
      input_detail: { catatan_agen: catatanAgen },
      hasil_ai: aiData,
      skor_waspas: { c1, c2, c3, Q1, Q2, Qi },
      status: statusKeputusan
    });

    return NextResponse.json({
      success: true,
      id: docRef.id,
      decision: statusKeputusan,
      score: Qi,
      detail: aiData,
      model: selectedModel
    });

  } catch (error: any) {
    console.error("Error Backend:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}