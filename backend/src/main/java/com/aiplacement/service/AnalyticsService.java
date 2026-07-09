package com.aiplacement.service;

import com.aiplacement.dto.response.AnalyticsResponse;

public interface AnalyticsService {
    AnalyticsResponse getAnalytics(String email);
}
