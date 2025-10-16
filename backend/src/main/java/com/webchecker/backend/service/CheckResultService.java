package com.webchecker.backend.service;

import com.webchecker.backend.dto.CheckResultDto;
import com.webchecker.backend.entity.CheckResult;
import com.webchecker.backend.repository.CheckResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CheckResultService {
    
    @Autowired
    private CheckResultRepository checkResultRepository;
    
    public List<CheckResultDto> getRecentChecksByUserId(String userId) {
        return checkResultRepository.findRecentByUserId(userId)
            .stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    public List<CheckResultDto> getChecksBySiteId(Long siteId, String userId) {
        return checkResultRepository.findBySiteIdAndUserId(siteId, userId)
            .stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    public CheckResultDto saveCheckResult(CheckResult checkResult) {
        CheckResult saved = checkResultRepository.save(checkResult);
        return convertToDto(saved);
    }
    
    public Double calculateUptimePercentage(Long siteId, String userId) {
        Long successfulChecks = checkResultRepository.countSuccessfulChecks(siteId, userId);
        Long totalChecks = checkResultRepository.countTotalChecks(siteId, userId);
        
        if (totalChecks == 0) {
            return 0.0;
        }
        
        return (successfulChecks.doubleValue() / totalChecks.doubleValue()) * 100.0;
    }
    
    private CheckResultDto convertToDto(CheckResult checkResult) {
        CheckResultDto dto = new CheckResultDto();
        dto.setId(checkResult.getId());
        dto.setSiteId(checkResult.getSiteId());
        dto.setTimestamp(checkResult.getTimestamp());
        dto.setStatus(checkResult.getStatus());
        dto.setResponseTime(checkResult.getResponseTime());
        dto.setStatusCode(checkResult.getStatusCode());
        dto.setError(checkResult.getError());
        dto.setSeoScore(checkResult.getSeoScore());
        return dto;
    }
}
