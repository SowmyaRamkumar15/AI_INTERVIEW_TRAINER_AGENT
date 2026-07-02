package com.aiplacement.service;

import com.aiplacement.dto.request.RoadmapRequest;
import com.aiplacement.dto.response.RoadmapResponse;

import java.util.List;

public interface RoadmapService {
    RoadmapResponse addRoadmapItem(String email, RoadmapRequest request);
    List<RoadmapResponse> getUserRoadmap(String email);
    RoadmapResponse updateStatus(String email, Long id, String status);
    void deleteItem(String email, Long id);
}
