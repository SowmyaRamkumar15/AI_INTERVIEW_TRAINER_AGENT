package com.aiplacement.service;

import com.aiplacement.dto.response.DashboardResponse;

public interface DashboardService {
    DashboardResponse getDashboardStats(String email);
}
