package com.aiplacement.controller;

import com.aiplacement.dto.response.DashboardResponse;
import com.aiplacement.response.ApiResponse;
import com.aiplacement.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboardStats(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getDashboardStats(authentication.getName()),
                "Dashboard stats fetched successfully"
        ));
    }
}
