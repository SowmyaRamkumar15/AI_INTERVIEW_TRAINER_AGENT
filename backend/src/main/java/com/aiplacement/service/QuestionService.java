package com.aiplacement.service;

import com.aiplacement.dto.request.QuestionRequest;
import com.aiplacement.dto.response.QuestionResponse;

import java.util.List;

public interface QuestionService {
    QuestionResponse createQuestion(QuestionRequest request);
    List<QuestionResponse> getAllQuestions();
    List<QuestionResponse> filterQuestions(String role, String difficulty, String company);
    QuestionResponse getById(Long id);
    void deleteQuestion(Long id);
}
