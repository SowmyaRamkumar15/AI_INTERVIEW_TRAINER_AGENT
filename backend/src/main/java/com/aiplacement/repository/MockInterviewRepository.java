package com.aiplacement.repository;

import com.aiplacement.entity.MockInterview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MockInterviewRepository extends JpaRepository<MockInterview, Long> {
    List<MockInterview> findByUserIdOrderByInterviewDateDesc(Long userId);
    long countByUserId(Long userId);
    @Query("SELECT AVG(m.score) FROM MockInterview m WHERE m.user.id = :userId AND m.score IS NOT NULL")
    Double findAverageScoreByUserId(@Param("userId") Long userId);
}
