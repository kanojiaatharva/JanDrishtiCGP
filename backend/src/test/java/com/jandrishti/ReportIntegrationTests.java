package com.jandrishti;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jandrishti.dto.request.ReportRequest;
import com.jandrishti.entity.User;
import com.jandrishti.entity.enums.Role;
import com.jandrishti.repository.ReportRepository;
import com.jandrishti.repository.UserRepository;
import com.jandrishti.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ReportIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtUtils jwtUtils;

    private String jwtToken;
    private User testUser;

    @BeforeEach
    void setUp() {
        reportRepository.deleteAll();
        userRepository.deleteAll();

        // Create a test user directly in repository
        testUser = new User();
        testUser.setName("Citizen Test");
        testUser.setEmail("citizen@example.com");
        testUser.setPhone("1111111111");
        testUser.setPasswordHash("hashed_dummy");
        testUser.setPreferredLanguage("en");
        testUser.setRole(Role.CITIZEN);
        userRepository.save(testUser);
        
        // Generate a token for the test user bypassing actual login
        com.jandrishti.security.CustomUserDetails userDetails = new com.jandrishti.security.CustomUserDetails(testUser);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_CITIZEN")));
        jwtToken = jwtUtils.generateJwtToken(authentication);
    }

    @Test
    void testCreateReportSuccess() throws Exception {
        ReportRequest request = new ReportRequest();
        request.setOriginalText("There is a large pothole in ward 7");
        request.setLanguage("en");
        request.setWard("7");

        mockMvc.perform(post("/api/reports")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void testCreateReportUnauthorized() throws Exception {
        ReportRequest request = new ReportRequest();
        request.setOriginalText("There is a large pothole in ward 7");
        request.setLanguage("en");

        mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized()); // Because no token provided
    }

    @Test
    void testGetMyReports() throws Exception {
        mockMvc.perform(get("/api/reports/my")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk());
    }
}
