package com.aiplacement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class MockInterviewResponse {
    private Long id;
    private String company;
    private String role;
    private Double score;
    private LocalDateTime interviewDate;
    private List<MockQuestionResponse> questions;

    @Data
    @Builder
    public static class MockQuestionResponse {
        private Long id;
        private String question;
        private String userAnswer;
        private String idealAnswer;
        private String feedback;
        private String difficulty;
        private Double score;
    }
}
