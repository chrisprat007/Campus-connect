// services/embeddingService.js

import { GoogleGenAI } from "@google/genai";

// Initialize once
const ai = new GoogleGenAI({});

/**
 * 🔥 Generate Gemini Text Response (RAG / Chat / Roadmap)
 */
export const generateGeminiResponse = async ({
  prompt,
  temperature = 0.7,
  maxOutputTokens = 1024
}) => {
  try {
    if (!prompt || !prompt.trim()) {
      throw new Error("Prompt is required for Gemini response");
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",  // ✅ FIXED MODEL NAME
      contents: prompt,
      generationConfig: {
        temperature,
        maxOutputTokens
      }
    });

    return response.text?.trim() || "";

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * 🔍 Generate embedding for a single text
 */
export const generateEmbedding = async (text) => {
  try {
    if (!text || !text.trim()) {
      throw new Error("Text is required for embedding");
    }

    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
      taskType: "SEMANTIC_SIMILARITY"
    });

    return response.embeddings[0].values;

  } catch (error) {
    console.error("Embedding Error:", error.message);
    throw error;
  }
};


/**
 * 🔍 Generate embeddings for multiple texts
 */
export const generateBatchEmbeddings = async (textsArray) => {
  try {
    if (!Array.isArray(textsArray) || textsArray.length === 0) {
      throw new Error("Array of texts is required for batch embedding");
    }

    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: textsArray,
      taskType: "SEMANTIC_SIMILARITY"
    });

    return response.embeddings.map(e => e.values);

  } catch (error) {
    console.error("Batch Embedding Error:", error.message);
    throw error;
  }
};