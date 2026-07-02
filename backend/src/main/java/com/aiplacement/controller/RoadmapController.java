package com.aiplacement.controller;

import com.aiplacement.dto.request.RoadmapRequest;
import com.aiplacement.dto.response.RoadmapResponse;
import com.aiplacement.response.ApiResponse;
import com.aiplacement.service.RoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmap")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoadmapResponse>>> getUserRoadmap(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                roadmapService.getUserRoadmap(authentication.getName()),
                "Roadmap fetched successfully"
        ));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoadmapResponse>> addRoadmapItem(
            Authentication authentication,
            @RequestBody RoadmapRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                roadmapService.addRoadmapItem(authentication.getName(), request),
                "Roadmap item added"
        ));
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<ApiResponse<RoadmapResponse>> updateStatus(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success(
                roadmapService.updateStatus(authentication.getName(), id, status),
                "Status updated"
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(
            Authentication authentication,
            @PathVariable Long id) {
        roadmapService.deleteItem(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success(null, "Roadmap item deleted"));
    }
}
