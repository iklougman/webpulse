package com.webchecker.backend.controller;

import com.webchecker.backend.dto.CheckResultDto;
import com.webchecker.backend.entity.CheckResult;
import com.webchecker.backend.service.CheckResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/worker")
@CrossOrigin(origins = "*")
public class WorkerController {
    
    @Autowired
    private CheckResultService checkResultService;
    
    @PostMapping("/check-result")
    public ResponseEntity<CheckResultDto> submitCheckResult(@Valid @RequestBody CheckResultDto checkResultDto) {
        try {
            CheckResult checkResult = convertToEntity(checkResultDto);
            CheckResultDto savedResult = checkResultService.saveCheckResult(checkResult);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedResult);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    private CheckResult convertToEntity(CheckResultDto dto) {
        CheckResult checkResult = new CheckResult();
        checkResult.setSiteId(dto.getSiteId());
        checkResult.setStatus(dto.getStatus());
        checkResult.setResponseTime(dto.getResponseTime());
        checkResult.setStatusCode(dto.getStatusCode());
        checkResult.setError(dto.getError());
        checkResult.setSeoScore(dto.getSeoScore());
        checkResult.setUserId("worker"); // Worker submissions don't have user context
        return checkResult;
    }
}
