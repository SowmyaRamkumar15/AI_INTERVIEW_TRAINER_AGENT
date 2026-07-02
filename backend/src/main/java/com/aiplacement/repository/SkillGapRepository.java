package com.aiplacement.repository;

import com.aiplacement.entity.SkillGap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface SkillGapRepository extends JpaRepository<SkillGap, Long> {
    List<SkillGap> findByUserId(Long userId);

    @Transactional
    void deleteByUserIdAndTargetRole(Long userId, String targetRole);
}
