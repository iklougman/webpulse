package com.webchecker.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class QueryParamDto {
    
    @NotBlank(message = "Parameter key is required")
    private String key;
    
    @NotBlank(message = "Parameter value is required")
    private String value;
    
    public QueryParamDto() {}
    
    public QueryParamDto(String key, String value) {
        this.key = key;
        this.value = value;
    }
    
    // Getters and setters
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}
