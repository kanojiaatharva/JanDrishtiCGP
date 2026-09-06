package com.jandrishti.ai;

import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class AIAnalysisValidator {

    private static final List<String> VALID_CATEGORIES = List.of(
            "DRINKING_WATER", "ROADS", "HEALTH", "SANITATION", "ELECTRICITY",
            "STREET_LIGHTING", "PUBLIC_TRANSPORT", "DRAINAGE", "WASTE_MANAGEMENT", "OTHER"
    );

    private static final List<String> VALID_URGENCIES = List.of("LOW", "MEDIUM", "HIGH", "CRITICAL");

    public boolean isValid(StructuredAnalysisResult result) {
        if (result == null) return false;

        if (result.getCategory() == null || !VALID_CATEGORIES.contains(result.getCategory())) {
            return false;
        }

        if (result.getUrgency() == null || !VALID_URGENCIES.contains(result.getUrgency())) {
            return false;
        }

        if (result.getConfidence() == null || result.getConfidence() < 0.0 || result.getConfidence() > 1.0) {
            return false;
        }

        // Basic sanity checks for lengths to avoid malicious prompt injections
        if (result.getSummary() != null && result.getSummary().length() > 1000) return false;
        if (result.getDescription() != null && result.getDescription().length() > 5000) return false;

        if (result.getLocation() != null) {
            if (result.getLocation().getWard() != null && result.getLocation().getWard().length() > 100) return false;
            if (result.getLocation().getDistrict() != null && result.getLocation().getDistrict().length() > 100) return false;
        }

        return true;
    }
    
    public StructuredAnalysisResult sanitize(StructuredAnalysisResult result) {
        // Enforce fallback if strictly needed
        if (!isValid(result)) {
            throw new IllegalArgumentException("AI output failed validation checks.");
        }
        return result;
    }
}
