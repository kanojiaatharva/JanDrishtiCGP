package com.jandrishti.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${GEMINI_API_KEY:}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=";

    public GeminiClient(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public StructuredAnalysisResult analyzeText(String promptText) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            throw new RuntimeException("GEMINI_API_KEY is not configured.");
        }

        GeminiRequest request = new GeminiRequest(promptText);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<GeminiRequest> entity = new HttpEntity<>(request, headers);

        try {
            GeminiResponse response = restTemplate.postForObject(
                    GEMINI_API_URL + geminiApiKey,
                    entity,
                    GeminiResponse.class
            );

            if (response != null && response.getFirstText() != null) {
                String jsonStr = response.getFirstText();
                // Clean up possible markdown blocks if gemini returns ```json ... ```
                if (jsonStr.startsWith("```json")) {
                    jsonStr = jsonStr.substring(7);
                }
                if (jsonStr.startsWith("```")) {
                    jsonStr = jsonStr.substring(3);
                }
                if (jsonStr.endsWith("```")) {
                    jsonStr = jsonStr.substring(0, jsonStr.length() - 3);
                }

                return objectMapper.readValue(jsonStr.trim(), StructuredAnalysisResult.class);
            }
        } catch (Exception e) {
            // Log failure securely, do not expose stack trace
            System.err.println("AI Call failed: " + e.getMessage());
            throw new RuntimeException("Failed to parse AI response.");
        }

        throw new RuntimeException("AI returned empty response.");
    }
}
