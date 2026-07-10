package com.greenco.service.impl;

import com.greenco.dto.AuthResponse;
import com.greenco.dto.LoginRequest;
import com.greenco.dto.RefreshTokenRequest;
import com.greenco.entity.RefreshToken;
import com.greenco.entity.Role;
import com.greenco.entity.User;
import com.greenco.exception.BusinessException;
import com.greenco.exception.ResourceNotFoundException;
import com.greenco.repository.RefreshTokenRepository;
import com.greenco.repository.UserRepository;
import com.greenco.security.CustomUserDetails;
import com.greenco.security.JwtProvider;
import com.greenco.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.greenco.dto.RegisterRequest;
import com.greenco.entity.Company;
import com.greenco.repository.CompanyRepository;
import com.greenco.repository.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.Instant;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.security.jwt.expiration-ms}")
    private long jwtExpirationInMs;

    @Value("${app.security.jwt.refresh-expiration-ms}")
    private long refreshExpirationInMs;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           JwtProvider jwtProvider,
                           RefreshTokenRepository refreshTokenRepository,
                           UserRepository userRepository,
                           CompanyRepository companyRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        String accessToken = jwtProvider.generateToken(userDetails);
        
        // Handle Refresh Token creation
        refreshTokenRepository.deleteByUser(user);
        RefreshToken refreshToken = createRefreshToken(user);

        return mapToAuthResponse(accessToken, refreshToken.getToken(), user);
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken token = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new ResourceNotFoundException("RefreshToken", "token", request.refreshToken()));

        if (token.isRevoked()) {
            throw new BusinessException("Refresh token has been revoked");
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new BusinessException("Refresh token has expired. Please log in again.");
        }

        // Apply Refresh Token Rotation (RTR)
        User user = token.getUser();
        refreshTokenRepository.delete(token);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String accessToken = jwtProvider.generateToken(userDetails);
        RefreshToken newRefreshToken = createRefreshToken(user);

        return mapToAuthResponse(accessToken, newRefreshToken.getToken(), user);
    }

    @Override
    @Transactional
    public void logout(String refreshTokenValue) {
        RefreshToken token = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new ResourceNotFoundException("RefreshToken", "token", refreshTokenValue));
        refreshTokenRepository.delete(token);
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(Instant.now().plusMillis(refreshExpirationInMs))
                .revoked(false)
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    private AuthResponse mapToAuthResponse(String accessToken, String refreshToken, User user) {
        AuthResponse.UserSummary userSummary = new AuthResponse.UserSummary(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRoles().stream().map(Role::getName).toList()
        );

        return new AuthResponse(
                accessToken,
                "Bearer",
                jwtExpirationInMs / 1000,
                refreshToken,
                userSummary
        );
    }

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new BusinessException("Passwords do not match");
        }
        if (userRepository.existsByEmail(request.companyEmail())) {
            throw new BusinessException("Email already exists");
        }
        if (companyRepository.existsByLegalName(request.companyName())) {
            throw new BusinessException("Company Name already exists");
        }
        if (companyRepository.existsByRegistrationNumber(request.companyRegistrationNumber())) {
            throw new BusinessException("Company Registration Number already exists");
        }

        Company company = Company.builder()
                .legalName(request.companyName())
                .industry(request.industry())
                .registrationNumber(request.companyRegistrationNumber())
                .taxId(request.gstNumber())
                .contactEmail(request.companyEmail())
                .contactPhone(request.phone())
                .website(request.website())
                .headquartersAddress(
                        (request.address() != null ? request.address() : "") + ", " +
                        (request.city() != null ? request.city() : "") + ", " +
                        (request.state() != null ? request.state() : "") + ", " +
                        request.country()
                )
                .contactPerson(request.contactPerson())
                .status("ACTIVE")
                .employeeCount(request.factoryCount())
                .logoUrl("https://placehold.co/100x100/10b981/ffffff?text=" + 
                        request.companyName().substring(0, Math.min(2, request.companyName().length())).toUpperCase())
                .build();

        company = companyRepository.save(company);

        Role companyRole = roleRepository.findByName("ROLE_MANUFACTURING_COMPANY")
                .orElseGet(() -> roleRepository.findByName("MANUFACTURING_COMPANY")
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "ROLE_MANUFACTURING_COMPANY")));

        String[] nameParts = request.contactPerson().split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        User user = User.builder()
                .email(request.companyEmail())
                .passwordHash(passwordEncoder.encode(request.password()))
                .firstName(firstName)
                .lastName(lastName)
                .status("ACTIVE")
                .companyId(company.getId())
                .roles(java.util.Set.of(companyRole))
                .build();

        userRepository.save(user);
    }

    @Override
    @Transactional
    public AuthResponse ssoLogin(String email, String provider) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String accessToken = jwtProvider.generateToken(userDetails);
        
        // Handle Refresh Token creation
        refreshTokenRepository.deleteByUser(user);
        RefreshToken refreshToken = createRefreshToken(user);

        return mapToAuthResponse(accessToken, refreshToken.getToken(), user);
    }
}
