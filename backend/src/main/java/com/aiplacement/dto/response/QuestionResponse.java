package com.aiplacement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class QuestionResponse {
    private Long id;
    private String company;
    private String role;
    private String difficulty;
    private String questionText;
    private String answer;
    private LocalDateTime createdAt;
}
