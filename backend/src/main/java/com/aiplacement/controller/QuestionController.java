package com.aiplacement.controller;

import com.aiplacement.dto.request.QuestionRequest;
import com.aiplacement.dto.response.QuestionResponse;
import com.aiplacement.response.ApiResponse;
import com.aiplacement.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(@RequestBody QuestionRequest request) {
        return ResponseEntity.ok(ApiResponse.success(questionService.createQuestion(request), "Question created successfully"));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> getAllQuestions() {
        return ResponseEntity.ok(ApiResponse.success(questionService.getAllQuestions(), "Questions fetched successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> filterQuestions(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String company) {
        return ResponseEntity.ok(ApiResponse.success(questionService.filterQuestions(role, difficulty, company), "Filtered questions fetched successfully"));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuestionResponse>> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(questionService.getById(id), "Question fetched successfully"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Question deleted successfully"));
    }
}
