package com.aiplacement.service.impl;

import com.aiplacement.dto.request.AnswerRequest;
import com.aiplacement.dto.response.AnswerResponse;
import com.aiplacement.entity.AnswerHistory;
import com.aiplacement.entity.Question;
import com.aiplacement.entity.User;
import com.aiplacement.exception.ResourceNotFoundException;
import com.aiplacement.repository.AnswerHistoryRepository;
import com.aiplacement.repository.QuestionRepository;
import com.aiplacement.repository.UserRepository;
import com.aiplacement.service.AnswerService;
import com.aiplacement.util.KeywordEvaluator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnswerServiceImpl implements AnswerService {

    private final AnswerHistoryRepository answerHistoryRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    @Override
    public AnswerResponse submitAnswer(String email, Long questionId, AnswerRequest request) {
        userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        // Use KeywordEvaluator for rule-based scoring
        KeywordEvaluator.EvaluationResult evalResult = KeywordEvaluator.evaluate(
                question.getQuestionText(), 
                request.getUserAnswer()
        );
        Double score = evalResult.score;
        String feedback = evalResult.feedback;

        AnswerHistory history = AnswerHistory.builder()
                .question(question)
                .userAnswer(request.getUserAnswer())
                .score(score)
                .feedback(feedback)
                .build();

        AnswerHistory saved = answerHistoryRepository.save(history);

        return AnswerResponse.builder()
                .id(saved.getId())
                .userAnswer(saved.getUserAnswer())
                .score(saved.getScore())
                .feedback(saved.getFeedback())
                .correctAnswer(question.getAnswer())
                .build();
    }
}
