package com.aiplacement.dto.request;

import lombok.Data;

@Data
public class RoadmapRequest {
    private Integer weekNumber;
    private String topic;
    private String status; // PENDING, IN_PROGRESS, COMPLETED
}
