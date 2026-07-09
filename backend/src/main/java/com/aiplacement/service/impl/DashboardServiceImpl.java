package com.aiplacement.service.impl;

import com.aiplacement.dto.response.DashboardResponse;
import com.aiplacement.entity.User;
import com.aiplacement.exception.ResourceNotFoundException;
import com.aiplacement.repository.*;
import com.aiplacement.enums.RoadmapStatus;
import com.aiplacement.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final MockInterviewRepository mockInterviewRepository;
    private final MockQuestionRepository mockQuestionRepository;
    private final AnswerHistoryRepository answerHistoryRepository;
    private final SkillRepository skillRepository;
    private final RoadmapRepository roadmapRepository;
    private final ResumeRepository resumeRepository;

    @Override
    public DashboardResponse getDashboardStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long totalInterviews = mockInterviewRepository.countByUserId(user.getId());
        Double avgScore = mockInterviewRepository.findAverageScoreByUserId(user.getId());
        long totalQuestionsAnswered = mockQuestionRepository.countByMockInterview_UserId(user.getId());
        long totalSkills = skillRepository.countByUserId(user.getId());
        long totalRoadmapItems = roadmapRepository.countByUserId(user.getId());
        long completedRoadmapItems = roadmapRepository.countByUserIdAndStatus(user.getId(), RoadmapStatus.COMPLETED);
        long totalResumes = resumeRepository.countByUserId(user.getId());

        return DashboardResponse.builder()
                .totalInterviews(totalInterviews)
                .totalQuestionsAnswered(totalQuestionsAnswered)
                .totalSkills(totalSkills)
                .totalRoadmapItems(totalRoadmapItems)
                .completedRoadmapItems(completedRoadmapItems)
                .averageInterviewScore(avgScore)
                .totalResumes(totalResumes)
                .build();
    }
}
