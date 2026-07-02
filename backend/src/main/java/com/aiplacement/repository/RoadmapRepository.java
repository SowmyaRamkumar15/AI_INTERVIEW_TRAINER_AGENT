package com.aiplacement.repository;

import com.aiplacement.entity.Roadmap;
import com.aiplacement.enums.RoadmapStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {
    List<Roadmap> findByUserIdOrderByWeekNumberAsc(Long userId);
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, RoadmapStatus status);
}
