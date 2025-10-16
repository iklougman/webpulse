package com.webchecker.backend.dto;

import com.webchecker.backend.entity.CheckResult;
import java.time.LocalDateTime;

public class CheckResultDto {
    
    private Long id;
    private Long siteId;
    private LocalDateTime timestamp;
    private CheckResult.CheckStatus status;
    private Integer responseTime;
    private Integer statusCode;
    private String error;
    private Integer seoScore;
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getSiteId() { return siteId; }
    public void setSiteId(Long siteId) { this.siteId = siteId; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public CheckResult.CheckStatus getStatus() { return status; }
    public void setStatus(CheckResult.CheckStatus status) { this.status = status; }
    
    public Integer getResponseTime() { return responseTime; }
    public void setResponseTime(Integer responseTime) { this.responseTime = responseTime; }
    
    public Integer getStatusCode() { return statusCode; }
    public void setStatusCode(Integer statusCode) { this.statusCode = statusCode; }
    
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    
    public Integer getSeoScore() { return seoScore; }
    public void setSeoScore(Integer seoScore) { this.seoScore = seoScore; }
}
