package com.smartsupport.service;

import com.smartsupport.dto.AuthResponse;
import com.smartsupport.dto.LoginRequest;
import com.smartsupport.dto.RegisterRequest;
import com.smartsupport.entity.Role;
import com.smartsupport.entity.User;
import com.smartsupport.exception.BadRequestException;
import com.smartsupport.repository.UserRepository;
import com.smartsupport.security.JwtUtil;
import com.smartsupport.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .state(request.getState())
                .district(request.getDistrict())
                .role(Role.USER)
                .build();

        user = userRepository.save(user);

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtUtil.generateToken(principal, user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtUtil.generateToken(principal, user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
