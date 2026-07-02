package com.aiplacement.service;

import com.aiplacement.dto.request.AnswerRequest;
import com.aiplacement.dto.response.AnswerResponse;

public interface AnswerService {
    AnswerResponse submitAnswer(String email, Long questionId, AnswerRequest request);
}
