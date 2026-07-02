package com.aiplacement.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeFile(MultipartFile file, Long userId);
    void deleteFile(String filePath);
}
