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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

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
        
        String text = extractTextFromPdf(file);
        
        String extractedEmail = extractEmail(text);
        String extractedPhone = extractPhone(text);
        String extractedName = extractName(text);
        String extractedSkills = extractSkills(text);
        String extractedEducation = extractEducation(text);
        String extractedExperience = extractExperience(text);
        String extractedProjects = extractProjects(text);
        
        Double atsScore = calculateAtsScore(extractedSkills, extractedEducation, extractedExperience, extractedProjects, extractedEmail, extractedPhone);

        Resume resume = Resume.builder()
                .user(user)
                .fileName(file.getOriginalFilename())
                .filePath(filePath)
                .name(extractedName)
                .email(extractedEmail)
                .phone(extractedPhone)
                .skills(extractedSkills)
                .education(extractedEducation)
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
                .name(resume.getName())
                .email(resume.getEmail())
                .phone(resume.getPhone())
                .skills(resume.getSkills())
                .education(resume.getEducation())
                .experience(resume.getExperience())
                .projects(resume.getProjects())
                .atsScore(resume.getAtsScore())
                .uploadedAt(resume.getUploadedAt())
                .build();
    }
    
    private String extractTextFromPdf(MultipartFile file) {
        try (PDDocument document = org.apache.pdfbox.Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (Exception e) {
            System.err.println("Error parsing PDF: " + e.getMessage());
            return "";
        }
    }

    private String extractEmail(String text) {
        Pattern pattern = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group();
        }
        return "Not found";
    }

    private String extractPhone(String text) {
        Pattern pattern = Pattern.compile("(\\+\\d{1,3}[- ]?)?\\d{10}");
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group();
        }
        return "Not found";
    }

    private String extractName(String text) {
        String[] lines = text.split("\\r?\\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.length() > 2 && trimmed.length() < 50 && !trimmed.matches(".*\\d.*") && !trimmed.toLowerCase().contains("resume")) {
                return trimmed;
            }
        }
        return "Unknown";
    }

    private String extractSkills(String text) {
        List<String> knownSkills = Arrays.asList("Java", "Spring Boot", "React", "MySQL", "Git", "Docker", "Python", "C++", "AWS", "SQL", "JavaScript", "HTML", "CSS", "Node.js", "Kubernetes", "Linux", "Machine Learning");
        List<String> foundSkills = new ArrayList<>();
        String lowerText = text.toLowerCase();
        
        for (String skill : knownSkills) {
            if (lowerText.contains(skill.toLowerCase())) {
                foundSkills.add(skill);
            }
        }
        
        if (foundSkills.isEmpty()) return "No specific skills detected";
        return String.join(", ", foundSkills);
    }

    private String extractEducation(String text) {
        String lowerText = text.toLowerCase();
        if (lowerText.contains("education") || lowerText.contains("b.tech") || lowerText.contains("b.e.") || lowerText.contains("university") || lowerText.contains("college")) {
            return "Education details found";
        }
        return "Not found";
    }
    
    private String extractExperience(String text) {
        String lowerText = text.toLowerCase();
        if (lowerText.contains("experience") || lowerText.contains("work history") || lowerText.contains("employment")) {
            return "Experience details found";
        }
        return "Not found";
    }
    
    private String extractProjects(String text) {
        String lowerText = text.toLowerCase();
        if (lowerText.contains("project") || lowerText.contains("portfolio")) {
            return "Projects details found";
        }
        return "Not found";
    }

    private Double calculateAtsScore(String skills, String education, String experience, String projects, String email, String phone) {
        double score = 0;
        
        // Skills score (up to 40)
        if (!skills.equals("No specific skills detected")) {
            int skillCount = skills.split(",").length;
            score += Math.min(skillCount * 10, 40);
        }
        
        // Sections score
        if (!education.equals("Not found")) score += 20;
        if (!experience.equals("Not found")) score += 20;
        if (!projects.equals("Not found")) score += 10;
        
        // Contact info score
        if (!email.equals("Not found")) score += 5;
        if (!phone.equals("Not found")) score += 5;
        
        return Math.min(score, 100.0);
    }
}
