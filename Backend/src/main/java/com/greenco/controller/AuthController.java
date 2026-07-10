package com.greenco.controller;

import com.greenco.common.BaseResponse;
import com.greenco.dto.AuthResponse;
import com.greenco.dto.LoginRequest;
import com.greenco.dto.RefreshTokenRequest;
import com.greenco.dto.RegisterRequest;
import com.greenco.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return new ResponseEntity<>(BaseResponse.success(response, "Login successful"), HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<BaseResponse<Void>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.register(registerRequest);
        return new ResponseEntity<>(BaseResponse.success(null, "Registration successful"), HttpStatus.CREATED);
    }

    @PostMapping("/sso")
    public ResponseEntity<BaseResponse<AuthResponse>> ssoLogin(@org.springframework.web.bind.annotation.RequestParam String email, @org.springframework.web.bind.annotation.RequestParam String provider) {
        AuthResponse response = authService.ssoLogin(email, provider);
        return new ResponseEntity<>(BaseResponse.success(response, "SSO Login successful"), HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<BaseResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return new ResponseEntity<>(BaseResponse.success(response, "Token refresh successful"), HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<BaseResponse<Void>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.refreshToken());
        return new ResponseEntity<>(BaseResponse.success(null, "Logout successful"), HttpStatus.OK);
    }
}
