package com.aiplacement.service.impl;

import com.aiplacement.dto.request.SkillRequest;
import com.aiplacement.dto.response.SkillResponse;
import com.aiplacement.entity.Skill;
import com.aiplacement.entity.User;
import com.aiplacement.exception.ResourceNotFoundException;
import com.aiplacement.repository.SkillRepository;
import com.aiplacement.repository.UserRepository;
import com.aiplacement.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public SkillResponse addSkill(String email, SkillRequest request) {
        User user = getUser(email);
        Skill skill = Skill.builder()
                .skillName(request.getSkillName())
                .user(user)
                .build();
        Skill saved = skillRepository.save(skill);
        return mapToResponse(saved);
    }

    @Override
    public List<SkillResponse> getUserSkills(String email) {
        User user = getUser(email);
        return skillRepository.findByUserId(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteSkill(String email, Long skillId) {
        User user = getUser(email);
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
        if (!skill.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Skill not found for this user");
        }
        skillRepository.delete(skill);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private SkillResponse mapToResponse(Skill skill) {
        return SkillResponse.builder()
                .id(skill.getId())
                .skillName(skill.getSkillName())
                .createdAt(skill.getCreatedAt())
                .build();
    }
}
