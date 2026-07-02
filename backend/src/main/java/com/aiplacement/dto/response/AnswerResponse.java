package com.aiplacement.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnswerResponse {
    private Long id;
    private String userAnswer;
    private Double score;
    private String feedback;
    private String correctAnswer;
}
