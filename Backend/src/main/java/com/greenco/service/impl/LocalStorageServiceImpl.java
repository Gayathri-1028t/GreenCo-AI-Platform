package com.greenco.service.impl;

import com.greenco.exception.BusinessException;
import com.greenco.service.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalStorageServiceImpl implements StorageService {

    private final Path rootLocation = Paths.get("greenco-uploads");

    public LocalStorageServiceImpl() {
        this.init();
    }

    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new BusinessException("Could not initialize storage directory", e);
        }
    }

    @Override
    public String store(MultipartFile file, String subFolder) {
        try {
            if (file.isEmpty()) {
                throw new BusinessException("Failed to store empty file.");
            }

            Path folderPath = this.rootLocation.resolve(subFolder);
            Files.createDirectories(folderPath);

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String uniqueFilename = UUID.randomUUID().toString() + extension;
            Path destinationFile = folderPath.resolve(Paths.get(uniqueFilename))
                    .normalize().toAbsolutePath();

            if (!destinationFile.getParent().equals(folderPath.toAbsolutePath())) {
                throw new BusinessException("Cannot store file outside current directory.");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
            
            // Return relative path key (e.g. subfolder/filename)
            return subFolder + "/" + uniqueFilename;
        } catch (IOException e) {
            throw new BusinessException("Failed to store file.", e);
        }
    }

    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new BusinessException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new BusinessException("Could not read file: " + filename, e);
        }
    }

    @Override
    public void delete(String filename) {
        try {
            Path file = load(filename);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new BusinessException("Failed to delete file: " + filename, e);
        }
    }
}
