package com.greenco.service;

import com.greenco.dto.AuthResponse;
import com.greenco.dto.LoginRequest;
import com.greenco.dto.RefreshTokenRequest;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse refreshToken(RefreshTokenRequest refreshTokenRequest);
    void logout(String refreshToken);
    void register(com.greenco.dto.RegisterRequest request);
    AuthResponse ssoLogin(String email, String provider);
}
