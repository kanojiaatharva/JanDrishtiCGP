package com.jandrishti.repository;

import com.jandrishti.entity.ClusterReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClusterReportRepository extends JpaRepository<ClusterReport, Long> {
}
