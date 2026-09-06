package com.jandrishti.ai;

import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final GeminiClient geminiClient;
    private final GeminiPromptBuilder promptBuilder;
    private final AIAnalysisValidator validator;

    public GeminiService(GeminiClient geminiClient, GeminiPromptBuilder promptBuilder, AIAnalysisValidator validator) {
        this.geminiClient = geminiClient;
        this.promptBuilder = promptBuilder;
        this.validator = validator;
    }

    public StructuredAnalysisResult processReport(String originalText, String language) {
        try {
            String prompt = promptBuilder.buildPrompt(originalText, language);
            StructuredAnalysisResult result = geminiClient.analyzeText(prompt);
            return validator.sanitize(result);
        } catch (Exception e) {
            // Return null or throw specific exceptions so the caller can mark it UNAVAILABLE
            System.err.println("Gemini Service Error: " + e.getMessage());
            return null;
        }
    }
}
