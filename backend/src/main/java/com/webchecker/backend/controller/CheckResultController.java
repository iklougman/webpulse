package com.webchecker.backend.controller;

import com.webchecker.backend.dto.CheckResultDto;
import com.webchecker.backend.service.CheckResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/checks")
@CrossOrigin(origins = "*")
public class CheckResultController {
    
    @Autowired
    private CheckResultService checkResultService;
    
    @GetMapping("/recent")
    public ResponseEntity<List<CheckResultDto>> getRecentChecks(Authentication authentication) {
        String userId = authentication.getName();
        List<CheckResultDto> checks = checkResultService.getRecentChecksByUserId(userId);
        return ResponseEntity.ok(checks);
    }
    
    @GetMapping("/site/{siteId}")
    public ResponseEntity<List<CheckResultDto>> getChecksBySite(@PathVariable Long siteId, Authentication authentication) {
        String userId = authentication.getName();
        List<CheckResultDto> checks = checkResultService.getChecksBySiteId(siteId, userId);
        return ResponseEntity.ok(checks);
    }
    
    @GetMapping("/site/{siteId}/uptime")
    public ResponseEntity<Double> getUptimePercentage(@PathVariable Long siteId, Authentication authentication) {
        String userId = authentication.getName();
        Double uptime = checkResultService.calculateUptimePercentage(siteId, userId);
        return ResponseEntity.ok(uptime);
    }
}
