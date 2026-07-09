package com.aiplacement.controller;

import com.aiplacement.dto.response.AnalyticsResponse;
import com.aiplacement.response.ApiResponse;
import com.aiplacement.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                analyticsService.getAnalytics(authentication.getName()),
                "Analytics fetched successfully"
        ));
    }
}
