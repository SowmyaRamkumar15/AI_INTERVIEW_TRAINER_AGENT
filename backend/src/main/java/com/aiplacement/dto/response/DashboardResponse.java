package com.aiplacement.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {
    private long totalInterviews;
    private long totalQuestionsAnswered;
    private long totalSkills;
    private long totalRoadmapItems;
    private long completedRoadmapItems;
    private Double averageInterviewScore;
    private long totalResumes;
}
