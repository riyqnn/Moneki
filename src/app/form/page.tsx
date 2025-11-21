"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface ModelAI {
  id: string;
  name: string;
}

const steps = ["Pilih Model", "Data Nasabah", "Catatan Agen", "Upload Foto"];

export default function KlaimFormWithAI() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [models, setModels] = useState<ModelAI[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [loadingModels, setLoadingModels] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchModels() {
      try {
        const res = await fetch("/api/get-models");
        const data = await res.json();
        if (!mounted) return;

        if (data.models && data.models.length > 0) {
          setModels(data.models);
          const defaultModel =
            data.models.find((m: ModelAI) => m.id.includes("flash")) ||
            data.models[0];
          setSelectedModel(defaultModel.id);
        }
      } catch (err) {
        console.error("Gagal ambil daftar model", err);
      } finally {
        if (mounted) setLoadingModels(false);
      }
    }
    fetchModels();
    return () => {
      mounted = false;
    };
  }, []);

  const updateFormData = (field: string, value: any) =>
    setFormData((prev: any) => ({ ...prev, [field]: value }));

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return selectedModel !== "";
      case 1:
        return formData.nama && formData.nama.trim() !== "";
      case 2:
        return formData.catatan && formData.catatan.trim() !== "";
      case 3:
        return formData.fotoAset && formData.fotoLogbook;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (!validateStep()) {
      alert("Lengkapi dulu data pada langkah ini.");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    setResult(null);

    try {
      const base64Aset = await toBase64(formData.fotoAset as File);
      const base64Logbook = await toBase64(formData.fotoLogbook as File);

      const payload = {
        nama: formData.nama,
        catatanAgen: formData.catatan,
        imageBase64Aset: base64Aset,
        imageBase64Logbook: base64Logbook,
        modelType: selectedModel,
      };

      const res = await fetch("/api/process-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
        setTimeout(() => {
          document
            .getElementById("result-card")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 200);
      } else {
        alert("Gagal: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
    <section className="relative w-full min-h-screen flex flex-col justify-between px-6 sm:px-10 py-10 text-left bg-background text-foreground">
      <div className="flex justify-center mb-8">
        <Navbar className="block mb-10" />
      </div>

      <div className=" flex flex-col justify-center lg:flex-row gap-12 flex-1">
        <aside className="lg:w-1/3">
          <h2 className="text-3xl font-bold text-custom3 mb-8">Langkah Form</h2>

          <nav className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 text-lg transition-colors ${
                  i === currentStep
                    ? "text-custom3 font-semibold"
                    : i < currentStep
                    ? "text-custom3/70"
                    : "text-foreground/50"
                }`}
              >
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium ${
                    i === currentStep
                      ? "bg-custom3 text-custom1"
                      : i < currentStep
                      ? "bg-custom3 text-custom1"
                      : "bg-custom3/15 text-foreground/60"
                  }`}
                >
                  {i < currentStep ? <Check size={18} /> : i + 1}
                </div>

                {step}
              </div>
            ))}
          </nav>
        </aside>

        {/* FORM */}
        <div className="flex-1 flex flex-col max-w-2xl">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-custom3 hover:text-custom3/80 mb-8 transition-colors"
            >
              <ChevronLeft size={20} />
              Kembali
            </button>
          )}

          <div className="flex flex-col space-y-5">
            {renderStep(
              currentStep,
              formData,
              updateFormData,
              models,
              selectedModel,
              setSelectedModel,
              loadingModels
            )}
          </div>

          <div className="mt-10 flex justify-end">
            <button
              onClick={handleNext}
              disabled={loadingSubmit}
              className="px-8 py-3 rounded-lg bg-custom3 text-white font-medium hover:bg-custom3/90 transition-colors disabled:opacity-60"
            >
              {loadingSubmit
                ? `Processing...`
                : currentStep === steps.length - 1
                ? "Submit"
                : "Lanjut"}
            </button>
          </div>
        </div>
      </div>

      {/* Result Card (same page) */}
      {result && (
        <div
          id="result-card"
          className="mt-12 max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md border"
        >
          <p className="text-sm text-gray-500">Model used: {result.model}</p>
          <h2
            className={`text-2xl font-bold mt-2 ${
              result.decision === "APPROVED" ? "text-green-600" : "text-red-600"
            }`}
          >
            Hasil: {result.decision}
          </h2>

          <p className="mt-2">
            <strong>Skor WASPAS:</strong> {Number(result.score).toFixed(3)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-custom1 p-4 rounded text-center">
              <strong>C1 (Aset)</strong>
              <div className="mt-2">{result.detail?.c1}</div>
            </div>
            <div className="bg-custom1 p-4 rounded text-center">
              <strong>C2 (Karakter)</strong>
              <div className="mt-2">{result.detail?.c2}</div>
            </div>
            <div className="bg-custom1 p-4 rounded text-center">
              <strong>C3 (Kapasitas)</strong>
              <div className="mt-2">{result.detail?.c3}</div>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-semibold">Analisis AI:</p>
            <ul className="list-disc ml-5 mt-2 text-gray-700">
              <li>{result.detail?.analisis_aset}</li>
              <li>{result.detail?.analisis_kapasitas}</li>
            </ul>
          </div>
        </div>
      )}
    </section>
      <Footer />
      </>
  );
}

function renderStep(
  step: number,
  formData: any,
  updateFormData: (f: string, v: any) => void,
  models: ModelAI[],
  selectedModel: string,
  setSelectedModel: (s: string) => void,
  loadingModels: boolean
) {
  const input = (label: string, field: string, type = "text") => (
    <div>
      <label className="block text-sm text-foreground/60 mb-1">{label}</label>
      <input
        type={type}
        value={formData[field] || ""}
        onChange={(e) => updateFormData(field, e.target.value)}
        className="w-full bg-custom1 border border-custom3/20 rounded-lg p-3"
      />
    </div>
  );

  switch (step) {
    case 0:
      return (
        <div>
          <label className="block text-sm mb-2 font-medium">
            Pilih Model AI
          </label>
          {loadingModels ? (
            <p className="text-sm text-gray-500">
              Sedang mengambil daftar model...
            </p>
          ) : (
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-3 border rounded bg-custom1"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.id})
                </option>
              ))}
            </select>
          )}
        </div>
      );

    case 1:
      return input("Nama Nasabah", "nama");

    case 2:
      return (
        <div>
          <label className="block text-sm mb-1">Catatan Agen</label>
          <textarea
            rows={5}
            value={formData.catatan || ""}
            onChange={(e) => updateFormData("catatan", e.target.value)}
            className="w-full bg-custom1 border border-custom3/20 rounded-lg p-3"
          />
        </div>
      );

    case 3:
      return (
        <>
          <div>
            <label className="block text-sm mb-1">Foto Aset</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                updateFormData("fotoAset", e.target.files?.[0] || null)
              }
              className="w-full"
            />
            {formData.fotoAset && (
              <p className="text-sm mt-2">
                {(formData.fotoAset as File).name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Foto Logbook</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                updateFormData("fotoLogbook", e.target.files?.[0] || null)
              }
              className="w-full"
            />
            {formData.fotoLogbook && (
              <p className="text-sm mt-2">
                {(formData.fotoLogbook as File).name}
              </p>
            )}
          </div>
        </>
      );

    default:
      return null;
  }
}
