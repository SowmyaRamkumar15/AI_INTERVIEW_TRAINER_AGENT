package com.aiplacement.dto.request;

import lombok.Data;

@Data
public class MockInterviewRequest {
    private String company;
    private String role;
    private String experience;
    private String difficulty;
    private int numberOfQuestions = 3;
}
