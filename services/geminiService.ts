import { GoogleGenAI, Type } from "@google/genai";
import { BookRecommendation } from '../types';

// Initialize Gemini
// Safely retrieve API Key from various environment configurations (Vite, CRA, Node)
const getApiKey = (): string => {
  try {
    // Vite uses import.meta.env
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY || import.meta.env.API_KEY || '';
    }
    // Webpack/CRA uses process.env
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || process.env.REACT_APP_API_KEY || '';
    }
  } catch (e) {
    console.warn("Error accessing environment variables:", e);
  }
  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const getAiBookRecommendations = async (query: string, excludeTitles: string[] = []): Promise<BookRecommendation[]> => {
  if (!apiKey) {
    // Fallback if no API key is present for demo purposes so the UI doesn't break
    console.warn("No API Key provided. Returning mock data.");
    await new Promise(resolve => setTimeout(resolve, 1500));

    // If we have excluded titles, return a different set of mock data to simulate "Loading More"
    if (excludeTitles.length > 0) {
      return [
        {
          title: "Psikologi Pemustaka",
          author: "Prof. Baca",
          year: "2022",
          summary: "Memahami perilaku pengunjung perpustakaan di era digital.",
          category: "Psikologi"
        },
        {
          title: "Desain Interior Perpustakaan",
          author: "Arsitek Pustaka",
          year: "2024",
          summary: "Menciptakan ruang baca yang nyaman dan estetik.",
          category: "Arsitektur"
        },
        {
          title: "Preservasi Bahan Pustaka",
          author: "Ratna Wilis",
          year: "2023",
          summary: "Teknik merawat buku fisik agar tahan lama.",
          category: "Konservasi"
        }
      ];
    }

    return [
      {
        title: "Panduan SLiMS untuk Pemula",
        author: "Tim Komunitas SLiMS",
        year: "2024",
        summary: "Buku panduan lengkap instalasi dan konfigurasi SLiMS untuk pustakawan sekolah.",
        category: "Teknologi"
      },
      {
        title: "Manajemen Perpustakaan Digital",
        author: "Dr. Pustaka",
        year: "2023",
        summary: "Strategi mengelola aset digital di era modern menggunakan teknologi cloud.",
        category: "Manajemen"
      },
      {
        title: "Literasi Informasi Abad 21",
        author: "Ahmad Literat",
        year: "2025",
        summary: "Membangun budaya baca siswa dengan bantuan kecerdasan buatan.",
        category: "Pendidikan"
      }
    ];
  }

  try {
    const excludeInstruction = excludeTitles.length > 0 
      ? `Do not include any of these books in the response: ${excludeTitles.join(', ')}.` 
      : "";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User search query: "${query}". 
      
      Act as an AI Librarian for a SLiMS (Senayan Library Management System) catalog. 
      Based on the user's search query, invent/generate 3 fictional but realistic book entries that might be found in a library related to the query.
      ${excludeInstruction}
      If the query is nonsense, recommend general best-sellers.
      Return the result in Indonesian.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              year: { type: Type.STRING },
              summary: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["title", "author", "year", "summary", "category"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as BookRecommendation[];
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const getAiChatResponse = async (userMessage: string): Promise<string> => {
  if (!apiKey) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "Maaf, saya sedang dalam mode demo (Tanpa API Key). Namun, saya sangat menyarankan Anda melihat bagian **Fitur** untuk melihat kecanggihan AI Librarian kami, atau scoll ke bagian **Harga** untuk penawaran terbaik!";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: "Kamu adalah Asisten Virtual Cerdas dan Proaktif untuk CloudSLiMS. Tugas utamamu adalah membantu calon pelanggan memahami keunggulan hosting SLiMS tanpa ribet server dan mendorong mereka untuk mendaftar.\n\nPanduan Gaya Bicara:\n1. Ramah, antusias, dan profesional.\n2. Selalu berusaha mengaitkan jawaban dengan Keuntungan Unik CloudSLiMS (seperti: Tanpa Server Fisik, AI Librarian, Backup Harian, Mobile Friendly).\n3. Secara proaktif arahkan user untuk mengecek bagian 'Fitur' atau 'Harga' jika relevan.\n4. Jika user bertanya soal biaya, tekankan betapa hematnya ini dibanding maintenance server sendiri.\n5. Gunakan Bahasa Indonesia yang natural.\n\nContoh respon jika ditanya 'Apa itu CloudSLiMS?': 'CloudSLiMS adalah solusi perpustakaan digital modern berbasis SLiMS. Anda tidak perlu pusing beli server mahal atau maintenance ribet. Cukup daftar, dan perpustakaan sekolah Anda langsung online! Ingin lihat pilihan paket hemat kami di bagian Harga?'",
      },
    });

    return response.text || "Maaf, saya tidak mengerti. Bisa diulangi?";
  } catch (error) {
    console.error("Chat Error", error);
    return "Maaf, terjadi kesalahan pada sistem AI kami. Silakan coba lagi nanti.";
  }
};