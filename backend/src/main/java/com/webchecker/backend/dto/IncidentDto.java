package com.webchecker.backend.dto;

import com.webchecker.backend.entity.Incident;
import java.time.LocalDateTime;

public class IncidentDto {
    
    private Long id;
    private Long siteId;
    private Incident.IncidentType type;
    private Incident.IncidentStatus status;
    private LocalDateTime startedAt;
    private LocalDateTime resolvedAt;
    private String message;
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getSiteId() { return siteId; }
    public void setSiteId(Long siteId) { this.siteId = siteId; }
    
    public Incident.IncidentType getType() { return type; }
    public void setType(Incident.IncidentType type) { this.type = type; }
    
    public Incident.IncidentStatus getStatus() { return status; }
    public void setStatus(Incident.IncidentStatus status) { this.status = status; }
    
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
