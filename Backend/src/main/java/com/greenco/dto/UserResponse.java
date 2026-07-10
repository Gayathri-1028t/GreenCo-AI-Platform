package com.greenco.dto;

import java.time.LocalDateTime;
import java.util.List;

public record UserResponse(
    Long id,
    String email,
    String firstName,
    String lastName,
    String status,
    List<String> roles,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
