package com.jandrishti;

import com.jandrishti.dto.request.LoginRequest;
import com.jandrishti.dto.request.RegisterRequest;
import com.jandrishti.entity.User;
import com.jandrishti.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void testRegistrationSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPhone("1234567890");
        request.setPassword("password");
        request.setPreferredLanguage("en");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        assertTrue(userRepository.existsByEmail("test@example.com"));
    }
    
    @Test
    void testRegistrationValidationFailure() throws Exception {
        RegisterRequest request = new RegisterRequest();
        // Missing fields to trigger validation failure
        
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLoginSuccess() throws Exception {
        // First Register
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setName("Test User");
        registerReq.setEmail("testlogin@example.com");
        registerReq.setPhone("1234567890");
        registerReq.setPassword("password123");
        registerReq.setPreferredLanguage("en");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isOk());

        // Then Login
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("testlogin@example.com");
        loginReq.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk());
    }
    
    @Test
    void testLoginInvalidCredentials() throws Exception {
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("nonexistent@example.com");
        loginReq.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isUnauthorized());
    }
}
