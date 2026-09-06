export interface LLMProvider {
    /**
     * Generates a structured response based on the prompt.
     * Should return a JSON string matching the extraction schema.
     */
    generateStructuredExtraction(prompt: string): Promise<string>;
}
export interface SpeechProvider {
    transcribe(audioBuffer: Buffer): Promise<string>;
}
export interface LanguageProvider {
    detect(text: string): Promise<string>;
}
export interface TranslationProvider {
    translate(text: string, targetLanguage: string): Promise<string>;
}
export interface EmbeddingProvider {
    embed(text: string): Promise<number[]>;
}
export interface GeocodingProvider {
    geocode(address: string): Promise<{
        latitude: number;
        longitude: number;
    } | null>;
}
