package com.greenco.common;

public final class AppConstants {
    private AppConstants() {
        // Prevents instantiation
    }

    // Pagination Constants
    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "20";
    public static final String DEFAULT_SORT_BY = "id";
    public static final String DEFAULT_SORT_DIRECTION = "desc";

    // Date Time Patterns
    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String DATE_FORMAT = "yyyy-MM-dd";

    // System Roles
    public static final String ROLE_SUPER_ADMIN = "SUPER_ADMIN";
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_COMPANY = "MANUFACTURING_COMPANY";
    public static final String ROLE_COORDINATOR = "GREENCO_COORDINATOR";
    public static final String ROLE_ASSESSOR = "GREENCO_ASSESSOR";

    // Certification Tiers
    public static final String TIER_CERTIFIED = "CERTIFIED";
    public static final String TIER_BRONZE = "BRONZE";
    public static final String TIER_SILVER = "SILVER";
    public static final String TIER_GOLD = "GOLD";
    public static final String TIER_PLATINUM = "PLATINUM";

    // Validation Regex Patterns
    public static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";
    public static final String REGISTRATION_NUMBER_REGEX = "^[A-Z0-9-]{5,20}$";
}
