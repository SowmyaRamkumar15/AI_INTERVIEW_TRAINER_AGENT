package com.aiplacement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SkillResponse {
    private Long id;
    private String skillName;
    private LocalDateTime createdAt;
}
