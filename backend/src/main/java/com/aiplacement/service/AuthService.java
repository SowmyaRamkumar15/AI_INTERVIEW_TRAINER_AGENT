package com.aiplacement.service;

import com.aiplacement.dto.request.LoginRequest;
import com.aiplacement.dto.request.RegisterRequest;
import com.aiplacement.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String token);
    void logout(String email);
}
