package com.aiplacement.controller;

import com.aiplacement.dto.request.MockInterviewRequest;
import com.aiplacement.dto.response.MockInterviewResponse;
import com.aiplacement.response.ApiResponse;
import com.aiplacement.service.MockInterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
public class MockInterviewController {

    private final MockInterviewService mockInterviewService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<MockInterviewResponse>> startInterview(
            Authentication authentication,
            @RequestBody MockInterviewRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                mockInterviewService.createInterview(authentication.getName(), request),
                "Mock interview started successfully"
        ));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<MockInterviewResponse>>> getUserInterviews(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                mockInterviewService.getUserInterviews(authentication.getName()),
                "Mock interviews fetched successfully"
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MockInterviewResponse>> getInterviewById(
            Authentication authentication,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                mockInterviewService.getInterviewById(authentication.getName(), id),
                "Mock interview fetched successfully"
        ));
    }
}
