package com.smartsupport.repository;

import com.smartsupport.entity.Application;
import com.smartsupport.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserOrderBySubmittedAtDesc(User user);
    List<Application> findBySchemeOfficerOrderBySubmittedAtDesc(User officer);
    Optional<Application> findByApplicationNumber(String applicationNumber);
    long countByStatus(com.smartsupport.entity.ApplicationStatus status);
}
