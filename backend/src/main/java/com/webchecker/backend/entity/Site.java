package com.webchecker.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sites")
public class Site {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Site name is required")
    @Size(max = 255)
    private String name;
    
    @NotBlank(message = "URL is required")
    @Pattern(regexp = "https?://.*", message = "URL must start with http:// or https://")
    private String url;
    
    @Min(value = 60, message = "Check interval must be at least 60 seconds")
    @Max(value = 86400, message = "Check interval must be at most 86400 seconds")
    private Integer checkInterval = 300; // 5 minutes default
    
    @Min(value = 5, message = "Timeout must be at least 5 seconds")
    @Max(value = 30, message = "Timeout must be at most 30 seconds")
    private Integer timeout = 10;
    
    @Embedded
    private Thresholds thresholds = new Thresholds();
    
    @ElementCollection
    @CollectionTable(name = "site_query_params", joinColumns = @JoinColumn(name = "site_id"))
    @AttributeOverrides({
        @AttributeOverride(name = "key", column = @Column(name = "param_key")),
        @AttributeOverride(name = "value", column = @Column(name = "param_value"))
    })
    @Size(max = 3, message = "Maximum 3 query parameters allowed")
    private List<QueryParam> queryParams;
    
    @Size(max = 255)
    private String healthEndpoint;
    
    private Boolean enabled = true;
    
    @NotBlank
    private String userId; // Supabase user ID
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    
    public Integer getCheckInterval() { return checkInterval; }
    public void setCheckInterval(Integer checkInterval) { this.checkInterval = checkInterval; }
    
    public Integer getTimeout() { return timeout; }
    public void setTimeout(Integer timeout) { this.timeout = timeout; }
    
    public Thresholds getThresholds() { return thresholds; }
    public void setThresholds(Thresholds thresholds) { this.thresholds = thresholds; }
    
    public List<QueryParam> getQueryParams() { return queryParams; }
    public void setQueryParams(List<QueryParam> queryParams) { this.queryParams = queryParams; }
    
    public String getHealthEndpoint() { return healthEndpoint; }
    public void setHealthEndpoint(String healthEndpoint) { this.healthEndpoint = healthEndpoint; }
    
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
