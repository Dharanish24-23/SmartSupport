package com.smartsupport.repository;

import com.smartsupport.entity.Document;
import com.smartsupport.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUser(User user);
}
