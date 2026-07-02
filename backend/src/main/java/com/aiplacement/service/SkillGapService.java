package com.aiplacement.service;

import com.aiplacement.entity.SkillGap;

import java.util.List;

public interface SkillGapService {
    List<SkillGap> getByUser(String email);
    List<SkillGap> analyze(String email, String targetRole);
}
