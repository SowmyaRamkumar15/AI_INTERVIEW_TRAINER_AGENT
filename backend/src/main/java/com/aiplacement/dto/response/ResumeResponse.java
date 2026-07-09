package com.aiplacement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ResumeResponse {
    private Long id;
    private String fileName;
    private String filePath;
    private String name;
    private String email;
    private String phone;
    private String skills;
    private String experience;
    private String projects;
    private String education;
    private Double atsScore;
    private LocalDateTime uploadedAt;
}
