package com.aiplacement.service;

import com.aiplacement.dto.request.MockInterviewRequest;
import com.aiplacement.dto.response.MockInterviewResponse;

import java.util.List;

public interface MockInterviewService {
    MockInterviewResponse createInterview(String email, MockInterviewRequest request);
    List<MockInterviewResponse> getUserInterviews(String email);
    MockInterviewResponse getInterviewById(String email, Long id);
}
