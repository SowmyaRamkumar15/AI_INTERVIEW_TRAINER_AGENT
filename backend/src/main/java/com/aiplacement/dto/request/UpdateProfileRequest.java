package com.aiplacement.dto.request;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    private String email;
    private String password;
    private String college;
    private String degree;
    private String experience;
    private String targetRole;
    private String targetCompany;
}
