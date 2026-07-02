package com.aiplacement.dto.request;

import lombok.Data;

@Data
public class QuestionRequest {
    private String company;
    private String role;
    private String difficulty;
    private String questionText;
    private String answer;
}
