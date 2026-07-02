package com.aiplacement.service;

import com.aiplacement.dto.request.UpdateProfileRequest;
import com.aiplacement.dto.response.UserResponse;

public interface UserService {
    UserResponse getProfile(String email);
    UserResponse updateProfile(String email, UpdateProfileRequest request);
}
