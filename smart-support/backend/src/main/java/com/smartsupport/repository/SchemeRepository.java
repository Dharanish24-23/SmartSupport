package com.smartsupport.repository;

import com.smartsupport.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SchemeRepository extends JpaRepository<Scheme, Long> {
    List<Scheme> findByActiveTrue();
}
