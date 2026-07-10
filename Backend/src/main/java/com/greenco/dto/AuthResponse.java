package com.greenco.dto;

import java.util.List;

public record AuthResponse(
    String accessToken,
    String tokenType,
    long expiresIn,
    String refreshToken,
    UserSummary user
) {
    public record UserSummary(
        Long id,
        String email,
        String firstName,
        String lastName,
        List<String> roles
    ) {}
}
