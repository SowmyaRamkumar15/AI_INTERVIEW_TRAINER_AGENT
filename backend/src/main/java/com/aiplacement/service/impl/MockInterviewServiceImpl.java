package com.aiplacement.service.impl;

import com.aiplacement.ai.AIService;
import com.aiplacement.dto.request.MockInterviewRequest;
import com.aiplacement.dto.response.MockInterviewResponse;
import com.aiplacement.entity.MockInterview;
import com.aiplacement.entity.MockQuestion;
import com.aiplacement.entity.User;
import com.aiplacement.exception.ResourceNotFoundException;
import com.aiplacement.repository.MockInterviewRepository;
import com.aiplacement.repository.MockQuestionRepository;
import com.aiplacement.repository.UserRepository;
import com.aiplacement.service.MockInterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MockInterviewServiceImpl implements MockInterviewService {

    private final MockInterviewRepository mockInterviewRepository;
    private final MockQuestionRepository mockQuestionRepository;
    private final UserRepository userRepository;
    private final AIService aiService;

    @Override
    @Transactional
    public MockInterviewResponse createInterview(String email, MockInterviewRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        MockInterview interview = MockInterview.builder()
                .user(user)
                .company(request.getCompany())
                .role(request.getRole())
                .interviewDate(LocalDateTime.now())
                .build();
                
        interview = mockInterviewRepository.save(interview);

        List<String> generatedQuestions = aiService.generateQuestions(
                request.getRole(),
                request.getExperience(),
                request.getNumberOfQuestions()
        );

        MockInterview finalInterview = interview;
        List<MockQuestion> mockQuestions = generatedQuestions.stream().map(q -> 
                MockQuestion.builder()
                        .mockInterview(finalInterview)
                        .question(q)
                        .difficulty(request.getDifficulty())
                        .build()
        ).collect(Collectors.toList());

        mockQuestionRepository.saveAll(mockQuestions);
        interview.setMockQuestions(mockQuestions);

        return mapToResponse(interview);
    }

    @Override
    public List<MockInterviewResponse> getUserInterviews(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mockInterviewRepository.findByUserIdOrderByInterviewDateDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MockInterviewResponse getInterviewById(String email, Long id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        MockInterview interview = mockInterviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mock interview not found"));

        if (!interview.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Mock interview not found for this user");
        }

        return mapToResponse(interview);
    }

    private MockInterviewResponse mapToResponse(MockInterview mockInterview) {
        return MockInterviewResponse.builder()
                .id(mockInterview.getId())
                .company(mockInterview.getCompany())
                .role(mockInterview.getRole())
                .score(mockInterview.getScore())
                .interviewDate(mockInterview.getInterviewDate())
                .questions(mockInterview.getMockQuestions() != null ? 
                        mockInterview.getMockQuestions().stream().map(q -> 
                                MockInterviewResponse.MockQuestionResponse.builder()
                                        .id(q.getId())
                                        .question(q.getQuestion())
                                        .userAnswer(q.getUserAnswer())
                                        .idealAnswer(q.getIdealAnswer())
                                        .feedback(q.getFeedback())
                                        .difficulty(q.getDifficulty())
                                        .score(q.getScore())
                                        .build()
                        ).collect(Collectors.toList()) : List.of())
                .build();
    }
}
