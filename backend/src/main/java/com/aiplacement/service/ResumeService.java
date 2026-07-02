package com.aiplacement.service;

import com.aiplacement.dto.response.ResumeResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResumeService {
    ResumeResponse uploadResume(String email, MultipartFile file);
    List<ResumeResponse> getUserResumes(String email);
    void deleteResume(String email, Long resumeId);
}
