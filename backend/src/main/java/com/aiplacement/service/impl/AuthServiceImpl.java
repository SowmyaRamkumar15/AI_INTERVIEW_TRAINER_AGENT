package com.aiplacement.service.impl;

import com.aiplacement.dto.request.LoginRequest;
import com.aiplacement.dto.request.RegisterRequest;
import com.aiplacement.dto.response.AuthResponse;
import com.aiplacement.entity.RefreshToken;
import com.aiplacement.entity.User;
import com.aiplacement.enums.Role;
import com.aiplacement.exception.DuplicateResourceException;
import com.aiplacement.exception.InvalidCredentialsException;
import com.aiplacement.exception.ResourceNotFoundException;
import com.aiplacement.mapper.UserMapper;
import com.aiplacement.repository.RefreshTokenRepository;
import com.aiplacement.repository.UserRepository;
import jakarta.persistence.EntityManager;
import com.aiplacement.security.CustomUserDetails;
import com.aiplacement.security.JwtUtil;
import com.aiplacement.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final EntityManager entityManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email already in use");
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? Role.valueOf(request.getRole().toUpperCase()) : Role.STUDENT);
        
        user = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtUtil.generateToken(userDetails);
        // Ensure no stale token exists before creating a new one
        refreshTokenRepository.deleteByUser(user);
        entityManager.flush();
        String refreshToken = createRefreshToken(user).getToken();

        return buildAuthResponse(user, token, refreshToken);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtUtil.generateToken(userDetails);
        
        // Delete old refresh tokens and create new one
        refreshTokenRepository.deleteByUser(user);
        // Flush the delete to DB before inserting the new token
        entityManager.flush();
        String refreshToken = createRefreshToken(user).getToken();

        return buildAuthResponse(user, token, refreshToken);
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .map(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    CustomUserDetails userDetails = new CustomUserDetails(user);
                    String newToken = jwtUtil.generateToken(userDetails);
                    return buildAuthResponse(user, newToken, token);
                })
                .orElseThrow(() -> new InvalidCredentialsException("Refresh token is not in database!"));
    }

    @Override
    @Transactional
    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        refreshTokenRepository.deleteByUser(user);
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(604800000L)) // 7 days
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    private RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new InvalidCredentialsException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    private AuthResponse buildAuthResponse(User user, String token, String refreshToken) {
        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(token)
                .refreshToken(refreshToken)
                .build();
    }
}
