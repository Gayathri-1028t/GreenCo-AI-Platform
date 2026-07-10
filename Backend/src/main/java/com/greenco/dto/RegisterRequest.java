package com.greenco.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "Company Name is required")
    String companyName,

    @NotBlank(message = "Industry is required")
    String industry,

    @NotBlank(message = "Company Registration Number is required")
    String companyRegistrationNumber,

    @NotBlank(message = "GST Number is required")
    String gstNumber,

    @NotBlank(message = "Company Email is required")
    @Email(message = "Company Email must be valid")
    String companyEmail,

    @NotBlank(message = "Phone Number is required")
    String phone,

    String website,

    @NotBlank(message = "Country is required")
    String country,

    String state,
    String city,
    String address,

    @NotNull(message = "Factory Count is required")
    Integer factoryCount,

    @NotBlank(message = "Contact Person is required")
    String contactPerson,

    String designation,

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    String password,

    @NotBlank(message = "Confirm Password is required")
    String confirmPassword
) {}
