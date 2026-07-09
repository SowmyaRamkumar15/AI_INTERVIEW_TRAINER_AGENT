package com.aiplacement.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String college;
    private String degree;
    private String experience;
    private String targetRole;
    private String targetCompany;
}
