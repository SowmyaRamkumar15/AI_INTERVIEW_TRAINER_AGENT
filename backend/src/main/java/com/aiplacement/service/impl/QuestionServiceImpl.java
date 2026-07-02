package com.aiplacement.service.impl;

import com.aiplacement.dto.request.QuestionRequest;
import com.aiplacement.dto.response.QuestionResponse;
import com.aiplacement.entity.Question;
import com.aiplacement.enums.Difficulty;
import com.aiplacement.exception.ResourceNotFoundException;
import com.aiplacement.repository.QuestionRepository;
import com.aiplacement.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;

    @Override
    @Transactional
    public QuestionResponse createQuestion(QuestionRequest request) {
        Question q = Question.builder()
                .company(request.getCompany())
                .role(request.getRole())
                .difficulty(request.getDifficulty() != null ? Difficulty.valueOf(request.getDifficulty().toUpperCase()) : null)
                .questionText(request.getQuestionText())
                .answer(request.getAnswer())
                .build();
        return mapToResponse(questionRepository.save(q));
    }

    @Override
    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<QuestionResponse> filterQuestions(String role, String difficulty, String company) {
        List<Question> questions;
        if (role != null && difficulty != null) {
            questions = questionRepository.findByRoleAndDifficulty(role, Difficulty.valueOf(difficulty.toUpperCase()));
        } else if (role != null) {
            questions = questionRepository.findByRole(role);
        } else if (difficulty != null) {
            questions = questionRepository.findByDifficulty(Difficulty.valueOf(difficulty.toUpperCase()));
        } else if (company != null) {
            questions = questionRepository.findByCompanyIgnoreCase(company);
        } else {
            questions = questionRepository.findAll();
        }
        return questions.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public QuestionResponse getById(Long id) {
        return questionRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
    }

    @Override
    @Transactional
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Question not found");
        }
        questionRepository.deleteById(id);
    }

    private QuestionResponse mapToResponse(Question q) {
        return QuestionResponse.builder()
                .id(q.getId())
                .company(q.getCompany())
                .role(q.getRole())
                .difficulty(q.getDifficulty() != null ? q.getDifficulty().name() : null)
                .questionText(q.getQuestionText())
                .answer(q.getAnswer())
                .createdAt(q.getCreatedAt())
                .build();
    }
}
