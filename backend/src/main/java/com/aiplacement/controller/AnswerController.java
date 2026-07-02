package com.aiplacement.controller;

import com.aiplacement.dto.request.AnswerRequest;
import com.aiplacement.dto.response.AnswerResponse;
import com.aiplacement.response.ApiResponse;
import com.aiplacement.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/answers")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    @PostMapping
    public ResponseEntity<ApiResponse<AnswerResponse>> submitAnswer(
            Authentication authentication,
            @RequestBody AnswerRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                answerService.submitAnswer(authentication.getName(), request.getQuestionId(), request),
                "Answer submitted successfully"
        ));
    }
}
