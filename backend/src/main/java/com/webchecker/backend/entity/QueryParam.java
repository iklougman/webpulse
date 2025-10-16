package com.webchecker.backend.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;

@Embeddable
@AttributeOverrides({
    @AttributeOverride(name = "key", column = @Column(name = "param_key")),
    @AttributeOverride(name = "value", column = @Column(name = "param_value"))
})
public class QueryParam {
    
    @NotBlank(message = "Parameter key is required")
    @Column(name = "param_key")
    private String key;
    
    @NotBlank(message = "Parameter value is required")
    @Column(name = "param_value")
    private String value;
    
    public QueryParam() {}
    
    public QueryParam(String key, String value) {
        this.key = key;
        this.value = value;
    }
    
    // Getters and setters
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}
