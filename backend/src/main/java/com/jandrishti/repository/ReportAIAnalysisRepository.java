package com.jandrishti.repository;

import com.jandrishti.entity.ReportAIAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportAIAnalysisRepository extends JpaRepository<ReportAIAnalysis, Long> {
    Optional<ReportAIAnalysis> findByReportId(Long reportId);
}
