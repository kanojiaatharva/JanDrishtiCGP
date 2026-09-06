package com.jandrishti.repository;

import com.jandrishti.entity.Report;
import com.jandrishti.entity.enums.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByCitizenId(Long citizenId);
    long countByStatus(ReportStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT r.category, COUNT(r) FROM Report r GROUP BY r.category")
    List<Object[]> countByCategory();
}
