package com.aiplacement.dto.request;

import lombok.Data;

@Data
public class ChatRequest {
    private String role;
    private String experience;
    private String message;
}
