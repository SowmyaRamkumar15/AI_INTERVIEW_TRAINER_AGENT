package com.aiplacement.repository;

import com.aiplacement.entity.MockQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MockQuestionRepository extends JpaRepository<MockQuestion, Long> {
    long countByMockInterview_UserId(Long userId);
}
