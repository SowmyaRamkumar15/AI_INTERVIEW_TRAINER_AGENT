package com.aiplacement.controller;

import com.aiplacement.entity.SkillGap;
import com.aiplacement.response.ApiResponse;
import com.aiplacement.service.SkillGapService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skill-gap")
@RequiredArgsConstructor
public class SkillGapController {

    private final SkillGapService skillGapService;

    @Data
    static class AnalyzeRequest {
        private String targetRole;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillGap>>> getSkillGaps(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                skillGapService.getByUser(authentication.getName()),
                "Skill gaps fetched"
        ));
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<List<SkillGap>>> analyze(
            Authentication authentication,
            @RequestBody AnalyzeRequest body) {
        return ResponseEntity.ok(ApiResponse.success(
                skillGapService.analyze(authentication.getName(), body.getTargetRole()),
                "Skill gap analysis complete"
        ));
    }
}
