export const FREE_MODELS = {
  openrouter: [
    { id: "meta-llama/llama-3.2-3b-instruct:free", name: "Llama 3.2 3B (Free)", context: 131072 },
    { id: "google/gemma-2-9b-it:free", name: "Gemma 2 9B (Free)", context: 8192 },
    { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B Instruct (Free)", context: 32768 },
    { id: "microsoft/phi-3-mini-128k-instruct:free", name: "Phi-3 Mini 128K (Free)", context: 128000 },
    { id: "nousresearch/hermes-3-llama-3.1-405b:free", name: "Hermes 3 Llama 3.1 405B (Free)", context: 131072 },
  ],
  groq: [
    { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", context: 131072 },
    { id: "llama3-8b-8192", name: "Llama 3 8B", context: 8192 },
    { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", context: 32768 },
    { id: "gemma2-9b-it", name: "Gemma 2 9B", context: 8192 },
  ],
} as const;
