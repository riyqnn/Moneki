import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export async function GET() {
  try {
    const q = query(
      collection(db, "loan_applications"),
      orderBy("skor_waspas.Qi", "desc")
    );

    const querySnapshot = await getDocs(q);

    // 2. Mapping data dari Firestore ke format JSON
    const rankingData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nama: data.nama_nasabah,
        tanggal: data.createdAt ? data.createdAt.toDate().toLocaleDateString('id-ID') : '-',
        c1: data.skor_waspas?.c1 || 0,
        c2: data.skor_waspas?.c2 || 0,
        c3: data.skor_waspas?.c3 || 0,
        total_skor: data.skor_waspas?.Qi || 0,
        status: data.status || "UNKNOWN",
        model: data.model_used || "unknown"
      };
    });

    return NextResponse.json({ success: true, data: rankingData });

  } catch (error: any) {
    console.error("Gagal ambil data:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}