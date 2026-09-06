package com.jandrishti.repository;

import com.jandrishti.entity.OfficerDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OfficerDecisionRepository extends JpaRepository<OfficerDecision, Long> {
    List<OfficerDecision> findByClusterId(Long clusterId);
}
