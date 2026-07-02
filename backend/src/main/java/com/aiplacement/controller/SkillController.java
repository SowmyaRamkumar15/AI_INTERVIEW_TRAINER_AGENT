package com.aiplacement.controller;

import com.aiplacement.dto.request.SkillRequest;
import com.aiplacement.dto.response.SkillResponse;
import com.aiplacement.response.ApiResponse;
import com.aiplacement.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @PostMapping
    public ResponseEntity<ApiResponse<SkillResponse>> addSkill(Authentication authentication, @RequestBody SkillRequest request) {
        return ResponseEntity.ok(ApiResponse.success(skillService.addSkill(authentication.getName(), request), "Skill added successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillResponse>>> getUserSkills(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(skillService.getUserSkills(authentication.getName()), "Skills fetched successfully"));
    }
    
    @DeleteMapping("/{skillId}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(Authentication authentication, @PathVariable Long skillId) {
        skillService.deleteSkill(authentication.getName(), skillId);
        return ResponseEntity.ok(ApiResponse.success(null, "Skill deleted successfully"));
    }
}
