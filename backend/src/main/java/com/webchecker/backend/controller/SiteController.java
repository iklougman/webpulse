package com.webchecker.backend.controller;

import com.webchecker.backend.dto.SiteDto;
import com.webchecker.backend.service.SiteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
@CrossOrigin(origins = "*")
public class SiteController {
    
    @Autowired
    private SiteService siteService;
    
    @GetMapping
    public ResponseEntity<List<SiteDto>> getSites(Authentication authentication) {
        String userId = authentication.getName();
        List<SiteDto> sites = siteService.getSitesByUserId(userId);
        return ResponseEntity.ok(sites);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SiteDto> getSite(@PathVariable Long id, Authentication authentication) {
        try {
            String userId = authentication.getName();
            SiteDto site = siteService.getSiteById(id, userId);
            return ResponseEntity.ok(site);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<SiteDto> createSite(@Valid @RequestBody SiteDto siteDto, Authentication authentication) {
        try {
            String userId = authentication.getName();
            SiteDto createdSite = siteService.createSite(siteDto, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSite);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SiteDto> updateSite(@PathVariable Long id, @Valid @RequestBody SiteDto siteDto, Authentication authentication) {
        try {
            String userId = authentication.getName();
            SiteDto updatedSite = siteService.updateSite(id, siteDto, userId);
            return ResponseEntity.ok(updatedSite);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSite(@PathVariable Long id, Authentication authentication) {
        try {
            String userId = authentication.getName();
            siteService.deleteSite(id, userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/count")
    public ResponseEntity<Long> getSiteCount(Authentication authentication) {
        String userId = authentication.getName();
        Long count = siteService.getSiteCountByUserId(userId);
        return ResponseEntity.ok(count);
    }
}
