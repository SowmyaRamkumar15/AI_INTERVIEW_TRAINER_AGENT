package com.aiplacement.repository;

import com.aiplacement.entity.Question;
import com.aiplacement.enums.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByRole(String role);
    List<Question> findByDifficulty(Difficulty difficulty);
    List<Question> findByCompanyIgnoreCase(String company);
    List<Question> findByRoleAndDifficulty(String role, Difficulty difficulty);
}
