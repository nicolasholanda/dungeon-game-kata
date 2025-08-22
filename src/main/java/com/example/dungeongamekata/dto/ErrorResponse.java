package com.example.dungeongamekata.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private String message;
    private int statusCode;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    private String path;
    private String error;

    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(String message, int statusCode) {
        this();
        this.message = message;
        this.statusCode = statusCode;
    }

    public ErrorResponse(String message, int statusCode, String path, String error) {
        this(message, statusCode);
        this.path = path;
        this.error = error;
    }
}
