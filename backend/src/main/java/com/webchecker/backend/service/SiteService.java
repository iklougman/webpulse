package com.webchecker.backend.service;

import com.webchecker.backend.dto.SiteDto;
import com.webchecker.backend.dto.ThresholdsDto;
import com.webchecker.backend.dto.QueryParamDto;
import com.webchecker.backend.entity.Site;
import com.webchecker.backend.entity.Thresholds;
import com.webchecker.backend.entity.QueryParam;
import com.webchecker.backend.repository.SiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SiteService {

    @Autowired
    private SiteRepository siteRepository;

    public List<SiteDto> getSitesByUserId(String userId) {
        return siteRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public SiteDto getSiteById(Long siteId, String userId) {
        Site site = siteRepository.findByUserIdAndId(userId, siteId);
        if (site == null) {
            throw new RuntimeException("Site not found");
        }
        return convertToDto(site);
    }

    public SiteDto createSite(SiteDto siteDto, String userId) {
        Site site = convertToEntity(siteDto);
        site.setUserId(userId);
        Site savedSite = siteRepository.save(site);
        return convertToDto(savedSite);
    }

    public SiteDto updateSite(Long siteId, SiteDto siteDto, String userId) {
        Site existingSite = siteRepository.findByUserIdAndId(userId, siteId);
        if (existingSite == null) {
            throw new RuntimeException("Site not found");
        }

        updateEntityFromDto(existingSite, siteDto);
        Site savedSite = siteRepository.save(existingSite);
        return convertToDto(savedSite);
    }

    public void deleteSite(Long siteId, String userId) {
        Site site = siteRepository.findByUserIdAndId(userId, siteId);
        if (site == null) {
            throw new RuntimeException("Site not found");
        }
        siteRepository.delete(site);
    }

    public Long getSiteCountByUserId(String userId) {
        return siteRepository.countByUserId(userId);
    }

    private SiteDto convertToDto(Site site) {
        SiteDto dto = new SiteDto();
        dto.setId(site.getId());
        dto.setName(site.getName());
        dto.setUrl(site.getUrl());
        dto.setCheckInterval(site.getCheckInterval());
        dto.setTimeout(site.getTimeout());
        dto.setHealthEndpoint(site.getHealthEndpoint());
        dto.setEnabled(site.getEnabled());

        // Convert thresholds
        ThresholdsDto thresholdsDto = new ThresholdsDto();
        thresholdsDto.setUptimePercent(site.getThresholds().getUptimePercent());
        thresholdsDto.setMaxLatency(site.getThresholds().getMaxLatency());
        thresholdsDto.setSeoScore(site.getThresholds().getSeoScore());
        dto.setThresholds(thresholdsDto);

        // Convert query params
        if (site.getQueryParams() != null) {
            dto.setQueryParams(site.getQueryParams().stream()
                    .map(qp -> new QueryParamDto(qp.getKey(), qp.getValue()))
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private Site convertToEntity(SiteDto dto) {
        Site site = new Site();
        site.setName(dto.getName());
        site.setUrl(dto.getUrl());
        site.setCheckInterval(dto.getCheckInterval());
        site.setTimeout(dto.getTimeout());
        site.setHealthEndpoint(dto.getHealthEndpoint());
        site.setEnabled(dto.getEnabled());

        // Convert thresholds
        Thresholds thresholds = new Thresholds();
        thresholds.setUptimePercent(dto.getThresholds().getUptimePercent());
        thresholds.setMaxLatency(dto.getThresholds().getMaxLatency());
        thresholds.setSeoScore(dto.getThresholds().getSeoScore());
        site.setThresholds(thresholds);

        // Convert query params
        if (dto.getQueryParams() != null) {
            site.setQueryParams(dto.getQueryParams().stream()
                    .map(qp -> new QueryParam(qp.getKey(), qp.getValue()))
                    .collect(Collectors.toList()));
        }

        return site;
    }

    private void updateEntityFromDto(Site site, SiteDto dto) {
        site.setName(dto.getName());
        site.setUrl(dto.getUrl());
        site.setCheckInterval(dto.getCheckInterval());
        site.setTimeout(dto.getTimeout());
        site.setHealthEndpoint(dto.getHealthEndpoint());
        site.setEnabled(dto.getEnabled());

        // Update thresholds
        site.getThresholds().setUptimePercent(dto.getThresholds().getUptimePercent());
        site.getThresholds().setMaxLatency(dto.getThresholds().getMaxLatency());
        site.getThresholds().setSeoScore(dto.getThresholds().getSeoScore());

        // Update query params
        if (dto.getQueryParams() != null) {
            site.setQueryParams(dto.getQueryParams().stream()
                    .map(qp -> new QueryParam(qp.getKey(), qp.getValue()))
                    .collect(Collectors.toList()));
        }
    }
}
