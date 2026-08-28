package com.smartsupport.service;

import com.smartsupport.entity.Document;
import com.smartsupport.entity.User;
import com.smartsupport.exception.BadRequestException;
import com.smartsupport.exception.ResourceNotFoundException;
import com.smartsupport.repository.DocumentRepository;
import com.smartsupport.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "jpg", "jpeg", "png");
    private static final long MAX_SIZE_BYTES = 5L * 1024 * 1024;

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public Document uploadDocument(Long userId, String documentType, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file was uploaded");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new BadRequestException("File size exceeds the maximum allowed limit of 5MB");
        }

        String originalName = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();
        String extension = "";
        int dotIndex = originalName.lastIndexOf('.');
        if (dotIndex >= 0) extension = originalName.substring(dotIndex + 1).toLowerCase();

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Only PDF, JPG, JPEG and PNG files are allowed");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String storedFileName = UUID.randomUUID() + "." + extension;
            Path targetPath = uploadPath.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetPath);

            Document document = Document.builder()
                    .user(user)
                    .documentType(documentType)
                    .fileName(originalName)
                    .filePath("uploads/" + storedFileName)
                    .build();

            return documentRepository.save(document);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }

    public List<Document> getDocumentsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return documentRepository.findByUser(user);
    }
}
