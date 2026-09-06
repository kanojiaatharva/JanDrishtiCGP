package com.jandrishti.repository;

import com.jandrishti.entity.DemandCluster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DemandClusterRepository extends JpaRepository<DemandCluster, Long> {
    Optional<DemandCluster> findByCategoryAndWardAndDistrict(String category, String ward, String district);
}
