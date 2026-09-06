package com.jandrishti.controller;

import com.jandrishti.service.DataSeederService;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/demo")
@Profile("!prod") // Never expose in production
public class DemoController {

    private final DataSeederService dataSeederService;

    public DemoController(DataSeederService dataSeederService) {
        this.dataSeederService = dataSeederService;
    }

    @PostMapping("/seed")
    public ResponseEntity<String> seedData() {
        dataSeederService.seedDemoData();
        return ResponseEntity.ok("Demo data seeded successfully. (Note: Only runs if DB is empty)");
    }
}
