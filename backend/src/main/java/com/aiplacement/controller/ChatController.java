package com.aiplacement.controller;

import com.aiplacement.dto.request.ChatRequest;
import com.aiplacement.dto.response.ChatResponse;
import com.aiplacement.entity.ChatHistory;
import com.aiplacement.response.ApiResponse;
import com.aiplacement.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ApiResponse<ChatResponse>> sendMessage(
            Authentication authentication,
            @RequestBody ChatRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                chatService.sendMessage(authentication.getName(), request),
                "Message sent successfully"
        ));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<ChatHistory>>> getChatHistory(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                chatService.getChatHistory(authentication.getName()),
                "Chat history fetched successfully"
        ));
    }
}
