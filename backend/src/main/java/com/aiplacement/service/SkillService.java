package com.aiplacement.service;

import com.aiplacement.dto.request.SkillRequest;
import com.aiplacement.dto.response.SkillResponse;

import java.util.List;

public interface SkillService {
    SkillResponse addSkill(String email, SkillRequest request);
    List<SkillResponse> getUserSkills(String email);
    void deleteSkill(String email, Long skillId);
}
