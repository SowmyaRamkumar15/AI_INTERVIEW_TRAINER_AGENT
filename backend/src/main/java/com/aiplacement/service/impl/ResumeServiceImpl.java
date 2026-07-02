package com.aiplacement.service.impl;

import com.aiplacement.dto.response.ResumeResponse;
import com.aiplacement.entity.Resume;
import com.aiplacement.entity.User;
import com.aiplacement.exception.ResourceNotFoundException;
import com.aiplacement.repository.ResumeRepository;
import com.aiplacement.repository.UserRepository;
import com.aiplacement.service.ResumeService;
import com.aiplacement.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public ResumeResponse uploadResume(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String filePath = fileStorageService.storeFile(file, user.getId());
        
        // Placeholder for PDF parsing and extraction logic (Phase 3 AI layer)
        String extractedSkills = "Java, Spring Boot, MySQL"; 
        String extractedExperience = "2 years of backend development";
        String extractedProjects = "AI Interview Trainer";
        Double atsScore = 85.0;

        Resume resume = Resume.builder()
                .user(user)
                .fileName(file.getOriginalFilename())
                .filePath(filePath)
                .skills(extractedSkills)
                .experience(extractedExperience)
                .projects(extractedProjects)
                .atsScore(atsScore)
                .uploadedAt(LocalDateTime.now())
                .build();

        return mapToResponse(resumeRepository.save(resume));
    }

    @Override
    public List<ResumeResponse> getUserResumes(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return resumeRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteResume(String email, Long resumeId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        if (!resume.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Resume not found for this user");
        }

        fileStorageService.deleteFile(resume.getFilePath());
        resumeRepository.delete(resume);
    }

    private ResumeResponse mapToResponse(Resume resume) {
        return ResumeResponse.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .filePath(resume.getFilePath())
                .atsScore(resume.getAtsScore())
                .uploadedAt(resume.getUploadedAt())
                .build();
    }
}
