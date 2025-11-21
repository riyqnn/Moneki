"use client";
import { useState, useEffect, FormEvent } from 'react';

// Tipe data model
interface ModelAI {
  id: string;
  name: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // STATE UNTUK MODEL
  const [models, setModels] = useState<ModelAI[]>([]); 
  const [selectedModel, setSelectedModel] = useState("");
  const [loadingModels, setLoadingModels] = useState(true);
  
  // 1. AMBIL DAFTAR MODEL SAAT LOAD HALAMAN
  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch('/api/get-models');
        const data = await res.json();
        
        if (data.models && data.models.length > 0) {
          setModels(data.models);
          console.log(models);
          // Set default ke model pertama, atau cari yang mengandung 'flash'
          const defaultModel = data.models.find((m: ModelAI) => m.id.includes('flash')) || data.models[0];
          setSelectedModel(defaultModel.id);
        }
      } catch (err) {
        console.error("Gagal ambil daftar model", err);
      } finally {
        setLoadingModels(false);
      }
    }

    fetchModels();
  }, []);

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const fileAset = formData.get('fotoAset') as File;
    const fileLogbook = formData.get('fotoLogbook') as File;

    try {
      const base64Aset = await toBase64(fileAset);
      const base64Logbook = await toBase64(fileLogbook);

      const res = await fetch('/api/process-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Jangan lupa header ini
        body: JSON.stringify({
          nama: formData.get('nama'),
          catatanAgen: formData.get('catatan'),
          imageBase64Aset: base64Aset,
          imageBase64Logbook: base64Logbook,
          modelType: selectedModel // <--- KIRIM PILIHAN MODEL KE BACKEND
        })
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        alert("Gagal: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>🤖 Moniq AI Scoring</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* --- DROPDOWN MODEL DINAMIS --- */}
        <div className=" p-3 rounded border border-blue-100">
            <label className="block font-bold text-sm mb-1">Pilih Model AI (Real-time dari Google):</label>
            {loadingModels ? (
                <p className="text-sm text-gray-500">Sedang mengambil daftar model...</p>
            ) : (
                <select 
                    value={selectedModel} 
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full p-2 border rounded "
                >
                    {models.map((model) => (
                        <option key={model.id} value={model.id}>
                            {model.name} ({model.id})
                        </option>
                    ))}
                </select>
            )}
        </div>


        <input name="nama" placeholder="Nama Nasabah" required style={{ padding: '10px' }} />
        <textarea name="catatan" placeholder="Catatan Agen (Karakter)" required style={{ padding: '10px', height: '80px' }} />
        
        {/* ... input file lainnya sama seperti sebelumnya ... */}
        <div>
          <label>Foto Aset Usaha:</label><br/>
          <input type="file" name="fotoAset" accept="image/*" required />
        </div>
        <div>
          <label>Foto Logbook/Keuangan:</label><br/>
          <input type="file" name="fotoLogbook" accept="image/*" required />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {loading ? `Sedang Menganalisa (${selectedModel})...` : "Proses Pinjaman"}
        </button>
      </form>
        
      {/* ... bagian hasil sama seperti sebelumnya ... */}
       {result && (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
          {/* Tampilkan model yang dipakai di hasil */}
          <p style={{fontSize:'12px', color:'#666'}}>Model used: {result.model}</p> 
          <h2 style={{ color: result.decision === 'APPROVED' ? 'green' : 'red' }}>
            Hasil: {result.decision}
          </h2>
          <p><strong>Skor WASPAS:</strong> {result.score.toFixed(3)}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '10px' }}>
             <div style={{background:'white', padding:'10px', textAlign:'center'}}>
                <strong>C1 (Aset)</strong><br/>{result.detail.c1}
             </div>
             <div style={{background:'white', padding:'10px', textAlign:'center'}}>
                <strong>C2 (Karakter)</strong><br/>{result.detail.c2}
             </div>
             <div style={{background:'white', padding:'10px', textAlign:'center'}}>
                <strong>C3 (Kapasitas)</strong><br/>{result.detail.c3}
             </div>
          </div>
          
          <p style={{marginTop: '15px'}}><strong>Analisis AI:</strong></p>
          <ul>
            <li>{result.detail.analisis_aset}</li>
            <li>{result.detail.analisis_kapasitas}</li>
          </ul>
        </div>
      )}
    </div>
  );
}