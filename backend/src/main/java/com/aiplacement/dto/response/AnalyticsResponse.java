package com.aiplacement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class AnalyticsResponse {
    
    private List<WeeklyPractice> weeklyPractice;
    private List<RolePerformance> rolePerformance;
    private List<ScoreTrend> scoreTrend;
    
    private String strongestTopic;
    private String weakestTopic;

    @Data
    @Builder
    public static class WeeklyPractice {
        private String week;
        private long count;
    }

    @Data
    @Builder
    public static class RolePerformance {
        private String role;
        private long count;
        private Double avgScore;
    }

    @Data
    @Builder
    public static class ScoreTrend {
        private LocalDate date;
        private Double score;
    }
}
