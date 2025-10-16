package com.webchecker.backend.repository;

import com.webchecker.backend.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    
    List<Incident> findByUserIdOrderByStartedAtDesc(String userId);
    
    @Query("SELECT i FROM Incident i WHERE i.userId = :userId AND i.status = 'ACTIVE' ORDER BY i.startedAt DESC")
    List<Incident> findActiveByUserId(@Param("userId") String userId);
    
    @Query("SELECT i FROM Incident i WHERE i.siteId = :siteId AND i.userId = :userId ORDER BY i.startedAt DESC")
    List<Incident> findBySiteIdAndUserId(@Param("siteId") Long siteId, @Param("userId") String userId);
    
    @Query("SELECT i FROM Incident i WHERE i.siteId = :siteId AND i.userId = :userId AND i.status = 'ACTIVE'")
    List<Incident> findActiveBySiteIdAndUserId(@Param("siteId") Long siteId, @Param("userId") String userId);
}
