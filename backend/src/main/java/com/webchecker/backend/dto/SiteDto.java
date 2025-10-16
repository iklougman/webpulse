package com.webchecker.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public class SiteDto {
    
    private Long id;
    
    @NotBlank(message = "Site name is required")
    @Size(max = 255)
    private String name;
    
    @NotBlank(message = "URL is required")
    @Pattern(regexp = "https?://.*", message = "URL must start with http:// or https://")
    private String url;
    
    @Min(value = 60, message = "Check interval must be at least 60 seconds")
    @Max(value = 86400, message = "Check interval must be at most 86400 seconds")
    private Integer checkInterval = 300;
    
    @Min(value = 5, message = "Timeout must be at least 5 seconds")
    @Max(value = 30, message = "Timeout must be at most 30 seconds")
    private Integer timeout = 10;
    
    @Valid
    private ThresholdsDto thresholds = new ThresholdsDto();
    
    @Size(max = 3, message = "Maximum 3 query parameters allowed")
    private List<QueryParamDto> queryParams;
    
    @Size(max = 255)
    private String healthEndpoint;
    
    private Boolean enabled = true;
    
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
    
    public ThresholdsDto getThresholds() { return thresholds; }
    public void setThresholds(ThresholdsDto thresholds) { this.thresholds = thresholds; }
    
    public List<QueryParamDto> getQueryParams() { return queryParams; }
    public void setQueryParams(List<QueryParamDto> queryParams) { this.queryParams = queryParams; }
    
    public String getHealthEndpoint() { return healthEndpoint; }
    public void setHealthEndpoint(String healthEndpoint) { this.healthEndpoint = healthEndpoint; }
    
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}
