import { GoogleGenAI, Type } from "@google/genai";
import { BookRecommendation } from '../types';

// Initialize Gemini
// Note: In a real production build, ensure process.env.API_KEY is defined in your build environment
const apiKey = process.env.API_KEY || ''; 
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