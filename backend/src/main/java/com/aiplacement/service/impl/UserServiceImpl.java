package com.aiplacement.service.impl;

import com.aiplacement.dto.request.UpdateProfileRequest;
import com.aiplacement.dto.response.UserResponse;
import com.aiplacement.entity.User;
import com.aiplacement.exception.ResourceNotFoundException;
import com.aiplacement.repository.UserRepository;
import com.aiplacement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getCollege() != null) user.setCollege(request.getCollege());
        if (request.getDegree() != null) user.setDegree(request.getDegree());
        if (request.getExperience() != null) user.setExperience(request.getExperience());
        if (request.getTargetRole() != null) user.setTargetRole(request.getTargetRole());
        if (request.getTargetCompany() != null) user.setTargetCompany(request.getTargetCompany());
        
        user = userRepository.save(user);
        return mapToResponse(user);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .college(user.getCollege())
                .degree(user.getDegree())
                .experience(user.getExperience())
                .targetRole(user.getTargetRole())
                .targetCompany(user.getTargetCompany())
                .build();
    }
}
