package com.webchecker.backend.repository;

import com.webchecker.backend.entity.CheckResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CheckResultRepository extends JpaRepository<CheckResult, Long> {
    
    List<CheckResult> findByUserIdOrderByTimestampDesc(String userId);
    
    @Query("SELECT cr FROM CheckResult cr WHERE cr.userId = :userId ORDER BY cr.timestamp DESC")
    List<CheckResult> findRecentByUserId(@Param("userId") String userId);
    
    @Query("SELECT cr FROM CheckResult cr WHERE cr.siteId = :siteId AND cr.userId = :userId ORDER BY cr.timestamp DESC")
    List<CheckResult> findBySiteIdAndUserId(@Param("siteId") Long siteId, @Param("userId") String userId);
    
    @Query("SELECT cr FROM CheckResult cr WHERE cr.userId = :userId AND cr.timestamp >= :since ORDER BY cr.timestamp DESC")
    List<CheckResult> findByUserIdAndTimestampAfter(@Param("userId") String userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(cr) FROM CheckResult cr WHERE cr.siteId = :siteId AND cr.userId = :userId AND cr.status = 'UP'")
    Long countSuccessfulChecks(@Param("siteId") Long siteId, @Param("userId") String userId);
    
    @Query("SELECT COUNT(cr) FROM CheckResult cr WHERE cr.siteId = :siteId AND cr.userId = :userId")
    Long countTotalChecks(@Param("siteId") Long siteId, @Param("userId") String userId);
}
