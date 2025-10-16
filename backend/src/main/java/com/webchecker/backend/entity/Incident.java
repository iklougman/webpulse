package com.webchecker.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
public class Incident {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "site_id")
    private Long siteId;
    
    @Enumerated(EnumType.STRING)
    @NotNull
    private IncidentType type;
    
    @Enumerated(EnumType.STRING)
    @NotNull
    private IncidentStatus status;
    
    @NotNull
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "user_id")
    private String userId; // Supabase user ID
    
    public enum IncidentType {
        PAGE_DOWN, HEALTH_FAIL, SLOW_3G, SLOW_4G, SEO_DROP
    }
    
    public enum IncidentStatus {
        ACTIVE, RESOLVED
    }
    
    // Constructors
    public Incident() {}
    
    public Incident(Long siteId, IncidentType type, String message, String userId) {
        this.siteId = siteId;
        this.type = type;
        this.message = message;
        this.userId = userId;
        this.status = IncidentStatus.ACTIVE;
        this.startedAt = LocalDateTime.now();
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getSiteId() { return siteId; }
    public void setSiteId(Long siteId) { this.siteId = siteId; }
    
    public IncidentType getType() { return type; }
    public void setType(IncidentType type) { this.type = type; }
    
    public IncidentStatus getStatus() { return status; }
    public void setStatus(IncidentStatus status) { this.status = status; }
    
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
