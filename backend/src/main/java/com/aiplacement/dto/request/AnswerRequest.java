package com.aiplacement.dto.request;

import lombok.Data;

@Data
public class AnswerRequest {
    private Long questionId;
    private String userAnswer;
}
