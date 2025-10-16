package com.webchecker.backend.entity;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Embeddable
public class Thresholds {
    
    @Min(value = 0, message = "Uptime percent must be at least 0")
    @Max(value = 100, message = "Uptime percent must be at most 100")
    private Integer uptimePercent = 99;
    
    @Min(value = 100, message = "Max latency must be at least 100ms")
    private Integer maxLatency = 2000;
    
    @Min(value = 0, message = "SEO score must be at least 0")
    @Max(value = 100, message = "SEO score must be at most 100")
    private Integer seoScore = 80;
    
    // Getters and setters
    public Integer getUptimePercent() { return uptimePercent; }
    public void setUptimePercent(Integer uptimePercent) { this.uptimePercent = uptimePercent; }
    
    public Integer getMaxLatency() { return maxLatency; }
    public void setMaxLatency(Integer maxLatency) { this.maxLatency = maxLatency; }
    
    public Integer getSeoScore() { return seoScore; }
    public void setSeoScore(Integer seoScore) { this.seoScore = seoScore; }
}
