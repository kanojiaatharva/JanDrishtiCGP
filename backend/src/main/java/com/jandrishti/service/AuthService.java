package com.jandrishti.service;

import com.jandrishti.dto.request.LoginRequest;
import com.jandrishti.dto.request.RegisterRequest;
import com.jandrishti.dto.response.AuthResponse;
import com.jandrishti.entity.User;
import com.jandrishti.entity.enums.Role;
import com.jandrishti.repository.UserRepository;
import com.jandrishti.security.CustomUserDetails;
import com.jandrishti.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(encoder.encode(request.getPassword()));
        user.setPreferredLanguage(request.getPreferredLanguage());
        user.setRole(Role.CITIZEN); // Default role is CITIZEN

        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return new AuthResponse(
                jwt,
                userDetails.getUser().getId(),
                userDetails.getUser().getName(),
                userDetails.getUser().getEmail(),
                userDetails.getUser().getRole().name()
        );
    }
}
