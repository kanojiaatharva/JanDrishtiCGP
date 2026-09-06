package com.jandrishti;

import com.jandrishti.ai.AIAnalysisValidator;
import com.jandrishti.ai.StructuredAnalysisResult;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class AIValidationTests {

    private final AIAnalysisValidator validator = new AIAnalysisValidator();

    @Test
    public void testValidAnalysis() {
        StructuredAnalysisResult result = new StructuredAnalysisResult();
        result.setCategory("DRINKING_WATER");
        result.setUrgency("HIGH");
        result.setConfidence(0.95);
        result.setSummary("Valid summary");
        
        assertTrue(validator.isValid(result));
    }

    @Test
    public void testInvalidCategory() {
        StructuredAnalysisResult result = new StructuredAnalysisResult();
        result.setCategory("ALIEN_INVASION"); // Invalid enum
        result.setUrgency("HIGH");
        result.setConfidence(0.95);
        
        assertFalse(validator.isValid(result));
    }

    @Test
    public void testInvalidConfidence() {
        StructuredAnalysisResult result = new StructuredAnalysisResult();
        result.setCategory("DRINKING_WATER");
        result.setUrgency("HIGH");
        result.setConfidence(1.5); // Invalid bound
        
        assertFalse(validator.isValid(result));
    }
}
