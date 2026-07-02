package com.aiplacement.controller;

import com.aiplacement.response.ApiResponse;
import com.aiplacement.service.WatsonChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/watson")
@RequiredArgsConstructor
public class WatsonChatController {

    private final WatsonChatService watsonChatService;

    @GetMapping("/token")
    public ResponseEntity<ApiResponse<Map<String, String>>> getWatsonToken(Authentication authentication) {
        String userId = null;
        if (authentication != null && authentication.isAuthenticated()) {
            userId = authentication.getName(); // Using email or username as the subject
        }
        
        String token = watsonChatService.generateWatsonToken(userId);
        
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        
        return ResponseEntity.ok(ApiResponse.success(response, "Watson JWT generated successfully"));
    }
}
