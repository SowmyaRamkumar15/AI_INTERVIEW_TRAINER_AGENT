package com.aiplacement.controller;

import com.aiplacement.dto.response.ResumeResponse;
import com.aiplacement.response.ApiResponse;
import com.aiplacement.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<ResumeResponse>> uploadResume(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success(
                resumeService.uploadResume(authentication.getName(), file),
                "Resume uploaded successfully"
        ));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ResumeResponse>>> getUserResumes(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                resumeService.getUserResumes(authentication.getName()),
                "Resumes fetched successfully"
        ));
    }
    
    @DeleteMapping("/{resumeId}")
    public ResponseEntity<ApiResponse<Void>> deleteResume(
            Authentication authentication,
            @PathVariable Long resumeId) {
        resumeService.deleteResume(authentication.getName(), resumeId);
        return ResponseEntity.ok(ApiResponse.success(null, "Resume deleted successfully"));
    }
    
    @PostMapping("/generate-questions")
    public ResponseEntity<ApiResponse<String>> generateQuestions(Authentication authentication) {
        // Placeholder for Phase 3 AI Integration
        return ResponseEntity.ok(ApiResponse.success("Questions generated based on resume (Placeholder)", "Success"));
    }
}
