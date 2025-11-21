"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Applicant {
  id: string;
  nama: string;
  tanggal: string;
  c1: number;
  c2: number;
  c3: number;
  total_skor: number;
  status: string;
  model: string;
}

export default function RankingPage() {
  const [data, setData] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRanking() {
      try {
        const res = await fetch('/api/ranking');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Error fetch ranking", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRanking();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      {/* Header & Tombol Kembali */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🏆 Peringkat Kelayakan Kredit</h1>
        <Link href="/" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm">
          ← Kembali ke Input
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Memuat data ranking...</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Rank</th>
                <th className="py-3 px-4 text-left">Nama Nasabah</th>
                <th className="py-3 px-4 text-center">C1 (Aset)</th>
                <th className="py-3 px-4 text-center">C2 (Karakter)</th>
                <th className="py-3 px-4 text-center">C3 (Kapasitas)</th>
                <th className="py-3 px-4 text-center font-bold">Skor Akhir (Qi)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">Belum ada data pelamar.</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className={`border-b hover:bg-gray-50 ${index < 3 ? 'bg-yellow-50' : ''}`}>
                    <td className="py-3 px-4 font-bold">
                      {index+1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{item.nama}</div>
                      <div className="text-xs text-gray-500">{item.tanggal} • {item.model}</div>
                    </td>
                    <td className="py-3 px-4 text-center">{item.c1}</td>
                    <td className="py-3 px-4 text-center">{item.c2}</td>
                    <td className="py-3 px-4 text-center">{item.c3}</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-600 text-lg">
                      {item.total_skor.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        item.status === 'APPROVED' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}