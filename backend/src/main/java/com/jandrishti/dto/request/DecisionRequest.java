package com.jandrishti.dto.request;

import com.jandrishti.entity.enums.Decision;
import jakarta.validation.constraints.NotNull;

public class DecisionRequest {
    
    @NotNull
    private Decision decision;
    
    private String comment;

    public Decision getDecision() { return decision; }
    public void setDecision(Decision decision) { this.decision = decision; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
