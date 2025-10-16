package com.webchecker.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "check_results")
public class CheckResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "site_id")
    private Long siteId;
    
    @NotNull
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
    
    @Enumerated(EnumType.STRING)
    @NotNull
    private CheckStatus status;
    
    @NotNull
    @Column(name = "response_time")
    private Integer responseTime; // in milliseconds
    
    @Column(name = "status_code")
    private Integer statusCode;
    
    @Column(columnDefinition = "TEXT")
    private String error;
    
    @Column(name = "seo_score")
    private Integer seoScore;
    
    @Column(name = "user_id")
    private String userId; // Supabase user ID
    
    public enum CheckStatus {
        UP, DOWN, TIMEOUT
    }
    
    // Constructors
    public CheckResult() {}
    
    public CheckResult(Long siteId, CheckStatus status, Integer responseTime, String userId) {
        this.siteId = siteId;
        this.status = status;
        this.responseTime = responseTime;
        this.userId = userId;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getSiteId() { return siteId; }
    public void setSiteId(Long siteId) { this.siteId = siteId; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public CheckStatus getStatus() { return status; }
    public void setStatus(CheckStatus status) { this.status = status; }
    
    public Integer getResponseTime() { return responseTime; }
    public void setResponseTime(Integer responseTime) { this.responseTime = responseTime; }
    
    public Integer getStatusCode() { return statusCode; }
    public void setStatusCode(Integer statusCode) { this.statusCode = statusCode; }
    
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    
    public Integer getSeoScore() { return seoScore; }
    public void setSeoScore(Integer seoScore) { this.seoScore = seoScore; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
