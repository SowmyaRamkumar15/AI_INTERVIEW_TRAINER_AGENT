package com.aiplacement.service.impl;

import com.aiplacement.dto.response.AnalyticsResponse;
import com.aiplacement.entity.MockInterview;
import com.aiplacement.entity.User;
import com.aiplacement.exception.ResourceNotFoundException;
import com.aiplacement.repository.MockInterviewRepository;
import com.aiplacement.repository.UserRepository;
import com.aiplacement.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final UserRepository userRepository;
    private final MockInterviewRepository mockInterviewRepository;

    @Override
    public AnalyticsResponse getAnalytics(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Long userId = user.getId();

        // 1. Role Performance & Strongest/Weakest Topic
        List<Object[]> rawRoleData = mockInterviewRepository.findRolePerformanceByUserId(userId);
        List<AnalyticsResponse.RolePerformance> rolePerformance = new ArrayList<>();
        
        String strongestTopic = "No data yet";
        String weakestTopic = "No data yet";

        if (rawRoleData != null && !rawRoleData.isEmpty()) {
            for (Object[] row : rawRoleData) {
                rolePerformance.add(AnalyticsResponse.RolePerformance.builder()
                        .role((String) row[0])
                        .count((Long) row[1])
                        .avgScore((Double) row[2])
                        .build());
            }
            
            // It's ordered by avgScore DESC, so first is strongest, last is weakest
            strongestTopic = rolePerformance.get(0).getRole();
            weakestTopic = rolePerformance.get(rolePerformance.size() - 1).getRole();
        }

        // 2. Weekly Practice (Last 4 weeks)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fourWeeksAgo = now.minusWeeks(4);
        List<MockInterview> recentInterviews = mockInterviewRepository.findByUserIdAndInterviewDateBetween(userId, fourWeeksAgo, now);

        Map<String, Long> weeklyCounts = new LinkedHashMap<>();
        // Initialize last 4 weeks with 0
        for (int i = 3; i >= 0; i--) {
            LocalDate weekStart = now.minusWeeks(i).toLocalDate();
            int weekNum = weekStart.get(WeekFields.ISO.weekOfWeekBasedYear());
            weeklyCounts.put("W" + weekNum, 0L);
        }

        for (MockInterview interview : recentInterviews) {
            int weekNum = interview.getInterviewDate().get(WeekFields.ISO.weekOfWeekBasedYear());
            String key = "W" + weekNum;
            if (weeklyCounts.containsKey(key)) {
                weeklyCounts.put(key, weeklyCounts.get(key) + 1);
            }
        }

        List<AnalyticsResponse.WeeklyPractice> weeklyPractice = weeklyCounts.entrySet().stream()
                .map(e -> AnalyticsResponse.WeeklyPractice.builder().week(e.getKey()).count(e.getValue()).build())
                .collect(Collectors.toList());

        // 3. Score Trend
        List<AnalyticsResponse.ScoreTrend> scoreTrend = mockInterviewRepository.findByUserIdOrderByInterviewDateDesc(userId)
                .stream()
                .limit(10) // Last 10 interviews
                .map(m -> AnalyticsResponse.ScoreTrend.builder()
                        .date(m.getInterviewDate().toLocalDate())
                        .score(m.getScore())
                        .build())
                .sorted(Comparator.comparing(AnalyticsResponse.ScoreTrend::getDate)) // chronological
                .collect(Collectors.toList());

        return AnalyticsResponse.builder()
                .weeklyPractice(weeklyPractice)
                .rolePerformance(rolePerformance)
                .scoreTrend(scoreTrend)
                .strongestTopic(strongestTopic)
                .weakestTopic(weakestTopic)
                .build();
    }
}
