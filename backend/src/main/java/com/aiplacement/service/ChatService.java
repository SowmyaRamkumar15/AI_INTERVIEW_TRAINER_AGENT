package com.aiplacement.service;

import com.aiplacement.dto.request.ChatRequest;
import com.aiplacement.dto.response.ChatResponse;
import com.aiplacement.entity.ChatHistory;

import java.util.List;

public interface ChatService {
    ChatResponse sendMessage(String email, ChatRequest request);
    List<ChatHistory> getChatHistory(String email);
}
