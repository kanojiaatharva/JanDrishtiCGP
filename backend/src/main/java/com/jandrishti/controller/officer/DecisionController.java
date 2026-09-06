package com.jandrishti.controller.officer;

import com.jandrishti.dto.request.DecisionRequest;
import com.jandrishti.entity.AuditLog;
import com.jandrishti.entity.DemandCluster;
import com.jandrishti.entity.OfficerDecision;
import com.jandrishti.repository.AuditLogRepository;
import com.jandrishti.repository.DemandClusterRepository;
import com.jandrishti.repository.OfficerDecisionRepository;
import com.jandrishti.security.CustomUserDetails;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/officer/clusters/{clusterId}/decision")
public class DecisionController {

    private final DemandClusterRepository demandClusterRepository;
    private final OfficerDecisionRepository officerDecisionRepository;
    private final AuditLogRepository auditLogRepository;

    public DecisionController(DemandClusterRepository demandClusterRepository,
                              OfficerDecisionRepository officerDecisionRepository,
                              AuditLogRepository auditLogRepository) {
        this.demandClusterRepository = demandClusterRepository;
        this.officerDecisionRepository = officerDecisionRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<?> makeDecision(@PathVariable Long clusterId,
                                          @Valid @RequestBody DecisionRequest request,
                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        DemandCluster cluster = demandClusterRepository.findById(clusterId)
                .orElseThrow(() -> new RuntimeException("Cluster not found"));
                
        OfficerDecision decision = new OfficerDecision();
        decision.setClusterId(clusterId);
        decision.setOfficerId(userDetails.getUser().getId());
        decision.setDecision(request.getDecision());
        decision.setComment(request.getComment());
        
        officerDecisionRepository.save(decision);
        
        AuditLog log = new AuditLog();
        log.setUserId(userDetails.getUser().getId());
        log.setAction("OFFICER_DECISION_CREATED");
        log.setEntityType("DemandCluster");
        log.setEntityId(clusterId.toString());
        log.setMetadata("Decision: " + request.getDecision().name());
        auditLogRepository.save(log);
        
        return ResponseEntity.ok("Decision recorded successfully");
    }
}
