package com.aiplacement.service.impl;

import com.aiplacement.entity.SkillGap;
import com.aiplacement.entity.User;
import com.aiplacement.enums.Priority;
import com.aiplacement.exception.ResourceNotFoundException;
import com.aiplacement.repository.SkillGapRepository;
import com.aiplacement.repository.SkillRepository;
import com.aiplacement.repository.UserRepository;
import com.aiplacement.service.SkillGapService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillGapServiceImpl implements SkillGapService {

    private final SkillGapRepository skillGapRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    // Predefined skills per role — replace with AI analysis in Phase 3
    private static final Map<String, List<String>> ROLE_SKILLS = Map.of(
            "Software Engineer",     List.of("Data Structures", "Algorithms", "System Design", "Java", "Spring Boot", "SQL"),
            "Frontend Developer",    List.of("React", "TypeScript", "CSS", "HTML", "REST APIs", "Testing"),
            "Backend Developer",     List.of("Java", "Spring Boot", "SQL", "REST APIs", "Microservices", "Docker"),
            "Full Stack Developer",  List.of("React", "Node.js", "Spring Boot", "SQL", "Docker", "Git"),
            "Data Scientist",        List.of("Python", "Machine Learning", "Statistics", "SQL", "TensorFlow", "Data Visualization"),
            "DevOps Engineer",       List.of("Docker", "Kubernetes", "CI/CD", "Linux", "Terraform", "AWS"),
            "Product Manager",       List.of("Product Strategy", "Agile", "Data Analysis", "User Research", "Roadmapping", "Stakeholder Management")
    );

    @Override
    public List<SkillGap> getByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<SkillGap> gaps = skillGapRepository.findByUserId(user.getId());
        
        Set<String> userSkills = skillRepository.findByUserId(user.getId()).stream()
                .map(s -> s.getSkillName().toLowerCase())
                .collect(Collectors.toSet());
                
        gaps.forEach(gap -> gap.setPresent(userSkills.contains(gap.getMissingSkill().toLowerCase())));
        
        return gaps;
    }

    @Override
    @Transactional
    public List<SkillGap> analyze(String email, String targetRole) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Clear old analysis for this user + role
        skillGapRepository.deleteByUserIdAndTargetRole(user.getId(), targetRole);

        List<String> required = ROLE_SKILLS.getOrDefault(targetRole,
                List.of("Communication", "Problem Solving", "Teamwork"));

        Set<String> userSkills = skillRepository.findByUserId(user.getId()).stream()
                .map(s -> s.getSkillName().toLowerCase())
                .collect(Collectors.toSet());

        List<SkillGap> allAnalysis = new ArrayList<>();
        List<SkillGap> gapsToSave = new ArrayList<>();

        for (String skill : required) {
            boolean isPresent = userSkills.contains(skill.toLowerCase());
            
            SkillGap gap = SkillGap.builder()
                    .user(user)
                    .targetRole(targetRole)
                    .missingSkill(skill)
                    .priority(Priority.HIGH)
                    .build();
            
            gap.setPresent(isPresent);
            allAnalysis.add(gap);
            
            if (!isPresent) {
                gapsToSave.add(gap);
            }
        }

        skillGapRepository.saveAll(gapsToSave);
        return allAnalysis;
    }
}
