package com.webchecker.backend.repository;

import com.webchecker.backend.entity.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteRepository extends JpaRepository<Site, Long> {
    
    List<Site> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<Site> findByUserIdAndEnabledTrueOrderByCreatedAtDesc(String userId);
    
    @Query("SELECT s FROM Site s WHERE s.userId = :userId AND s.id = :siteId")
    Site findByUserIdAndId(@Param("userId") String userId, @Param("siteId") Long siteId);
    
    @Query("SELECT COUNT(s) FROM Site s WHERE s.userId = :userId")
    Long countByUserId(@Param("userId") String userId);
}
