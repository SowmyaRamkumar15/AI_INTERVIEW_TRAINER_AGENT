package com.aiplacement.repository;

import com.aiplacement.entity.AnswerHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerHistoryRepository extends JpaRepository<AnswerHistory, Long> {
    List<AnswerHistory> findByQuestionId(Long questionId);
    long countByQuestion_IdIn(List<Long> questionIds);
}
