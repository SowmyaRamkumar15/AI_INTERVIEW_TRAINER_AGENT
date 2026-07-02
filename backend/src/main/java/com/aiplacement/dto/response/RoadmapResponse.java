package com.aiplacement.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoadmapResponse {
    private Long id;
    private Integer weekNumber;
    private String topic;
    private String status;
}
