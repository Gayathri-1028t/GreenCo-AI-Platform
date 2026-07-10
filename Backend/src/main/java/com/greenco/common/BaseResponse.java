package com.greenco.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaseResponse<T> {
    private LocalDateTime timestamp;
    private boolean success;
    private String message;
    private T data;
    private List<ValidationError> errors;

    public static <T> BaseResponse<T> success(T data, String message) {
        return BaseResponse.<T>builder()
                .timestamp(LocalDateTime.now())
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> BaseResponse<T> success(T data) {
        return success(data, "Request processed successfully");
    }

    public static <T> BaseResponse<T> error(String message, List<ValidationError> errors) {
        return BaseResponse.<T>builder()
                .timestamp(LocalDateTime.now())
                .success(false)
                .message(message)
                .errors(errors)
                .build();
    }

    public static <T> BaseResponse<T> error(String message) {
        return error(message, null);
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ValidationError {
        private String field;
        private String message;
    }
}
