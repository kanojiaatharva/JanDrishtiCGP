package com.jandrishti.service;

import com.jandrishti.entity.DemandCluster;
import com.jandrishti.entity.Notification;
import com.jandrishti.entity.User;
import com.jandrishti.entity.enums.Role;
import com.jandrishti.repository.DemandClusterRepository;
import com.jandrishti.repository.NotificationRepository;
import com.jandrishti.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DataSeederService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DemandClusterRepository demandClusterRepository;
    private final NotificationRepository notificationRepository;

    public DataSeederService(UserRepository userRepository,
                             PasswordEncoder passwordEncoder,
                             DemandClusterRepository demandClusterRepository,
                             NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.demandClusterRepository = demandClusterRepository;
        this.notificationRepository = notificationRepository;
    }

    public void seedDemoData() {
        if (userRepository.count() > 0) {
            return; // Already seeded
        }

        // Create demo citizen
        User citizen = new User();
        citizen.setName("Meena Sharma");
        citizen.setEmail("citizen@demo.com");
        citizen.setPhone("9876543210");
        citizen.setPasswordHash(passwordEncoder.encode("password"));
        citizen.setRole(Role.CITIZEN);
        citizen.setPreferredLanguage("hi");
        userRepository.save(citizen);

        // Create demo officer
        User officer = new User();
        officer.setName("Officer Rajesh Kumar");
        officer.setEmail("officer@demo.com");
        officer.setPhone("9876543211");
        officer.setPasswordHash(passwordEncoder.encode("password"));
        officer.setRole(Role.OFFICER);
        officer.setPreferredLanguage("en");
        userRepository.save(officer);

        // Seed 5 demand clusters (fast — no per-report processing)
        seedCluster("DRINKING_WATER", "Water Supply", "Ward 14", "Indore", 22.7196, 75.8577,
                540, 92.0, 38.0, 8.5, 9.2, 8.8,
                "540 citizens from Ward 14 reported contaminated or absent water supply in the past 30 days. Complaints are growing 38% week-over-week.",
                "Deploy emergency water tankers;Inspect pipeline for leaks;Test water quality parameters;Schedule infrastructure audit");

        seedCluster("ROADS", "Road Damage / Potholes", "Ward 7", "Indore", 22.7250, 75.8620,
                214, 74.0, 22.0, 6.1, 7.4, 6.8,
                "214 pothole and road damage reports in Ward 7. Monsoon season has accelerated deterioration with increasing accident risk.",
                "Dispatch road repair crew;Apply temporary cold-mix patching;Schedule full resurfacing;Install warning signs");

        seedCluster("ROADS", "Road Damage / Potholes", "Ward 3", "Indore", 22.7050, 75.8500,
                196, 68.0, 18.0, 5.9, 6.8, 6.2,
                "196 road damage complaints near school zones in Ward 3. Elevated risk to children's safety during peak school hours.",
                "Prioritize school zone repairs;Install rubber speed-bumps;Increase night patrolling;Permanent repair schedule");

        seedCluster("HEALTH", "Hospital / Sanitation", "Ward 21", "Indore", 22.7350, 75.8700,
                152, 61.0, 15.0, 5.2, 6.0, 5.8,
                "152 sanitation and hygiene complaints from the Ward 21 community health center. Critical staffing gaps reported by residents.",
                "Conduct immediate sanitation audit;Deploy cleaning staff;Review hospital staffing;Procure hygiene supplies");

        seedCluster("OTHER", "Streetlights / Garbage", "Ward 18", "Indore", 22.7100, 75.8650,
                98, 42.0, 8.0, 3.8, 4.2, 4.0,
                "Miscellaneous civic complaints in Ward 18 — broken streetlights (63) and irregular garbage collection (35).",
                "Replace faulty streetlight bulbs;Fix garbage collection schedule;Coordinate with ward committee;Community awareness drive");

        // Seed demo notifications for citizen
        createNotification(citizen.getId(), null, "AI Analysis Complete",
                "Your report about drinking water has been AI-processed. Category: DRINKING_WATER, Urgency: HIGH", "AI_COMPLETE");
        createNotification(citizen.getId(), null, "Report Under Review",
                "An officer is reviewing your complaint about water supply in Ward 14.", "STATUS_UPDATE");
        createNotification(citizen.getId(), null, "Action Approved!",
                "Great news! Your complaint has been escalated. Emergency water tankers have been dispatched.", "ACTION_APPROVED");

        // Seed demo notifications for officer
        createNotification(officer.getId(), null, "New High-Priority Cluster",
                "Ward 14 Drinking Water cluster has crossed 500 reports. Priority Score: 92/100. Immediate action recommended.", "CRITICAL");
        createNotification(officer.getId(), null, "Weekly Intelligence Report",
                "This week: 1,200 new reports. Top issue: Drinking Water (42%). Ward 14 remains highest priority hotspot.", "REPORT");
        createNotification(officer.getId(), null, "Cluster Growth Alert",
                "Ward 7 Roads cluster grew 22% in the last 7 days. Now 214 reports. Monsoon season correlation detected.", "ALERT");

        System.out.println("[JanDrishti] Demo data seeded: 2 users, 5 clusters, 6 notifications.");
    }

    private void seedCluster(String category, String subcategory, String ward, String district,
                             double lat, double lng,
                             int reportCount, double priorityScore, double growthRate,
                             double serviceGapScore, double urgencyScore, double demandScore,
                             String summary, String recommendedActions) {
        DemandCluster cluster = new DemandCluster();
        cluster.setCategory(category);
        cluster.setSubcategory(subcategory);
        cluster.setWard(ward);
        cluster.setDistrict(district);
        cluster.setReportCount(reportCount);
        cluster.setPriorityScore(priorityScore);
        cluster.setGrowthRate(growthRate);
        cluster.setServiceGapScore(serviceGapScore);
        cluster.setUrgencyScore(urgencyScore);
        cluster.setDemandScore(demandScore);
        cluster.setLatitude(lat);
        cluster.setLongitude(lng);
        cluster.setSummary(summary);
        cluster.setRecommendedActions(recommendedActions);
        demandClusterRepository.save(cluster);
    }

    private void createNotification(Long userId, Long reportId, String title, String message, String type) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setReportId(reportId);
        n.setTitle(title);
        n.setMessage(message);
        n.setType(type);
        n.setRead(false);
        notificationRepository.save(n);
    }
}
