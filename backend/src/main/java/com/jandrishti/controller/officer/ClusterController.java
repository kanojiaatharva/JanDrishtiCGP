package com.jandrishti.controller.officer;

import com.jandrishti.entity.DemandCluster;
import com.jandrishti.repository.DemandClusterRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/officer/clusters")
@PreAuthorize("hasRole('OFFICER')")
public class ClusterController {

    private final DemandClusterRepository demandClusterRepository;

    public ClusterController(DemandClusterRepository demandClusterRepository) {
        this.demandClusterRepository = demandClusterRepository;
    }

    @GetMapping
    public ResponseEntity<List<DemandCluster>> getClusters() {
        // In a real app this would be paginated and filterable
        List<DemandCluster> clusters = demandClusterRepository.findAll(Sort.by(Sort.Direction.DESC, "priorityScore"));
        return ResponseEntity.ok(clusters);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DemandCluster> getClusterById(@PathVariable Long id) {
        DemandCluster cluster = demandClusterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cluster not found"));
        return ResponseEntity.ok(cluster);
    }
}
