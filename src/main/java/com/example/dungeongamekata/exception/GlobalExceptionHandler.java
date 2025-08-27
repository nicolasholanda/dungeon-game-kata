package com.example.dungeongamekata.exception;

import com.example.dungeongamekata.dto.ErrorResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@Slf4j
@ControllerAdvice(basePackages = "com.example.dungeongamekata.controller")
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidDungeonInputException.class)
    public ResponseEntity<ErrorResponse> handleInvalidDungeonInputException(
            InvalidDungeonInputException ex, WebRequest request) {

        log.warn("Invalid dungeon input: {} at {}", ex.getMessage(), request.getDescription(false), ex);

        ErrorResponse errorResponse = new ErrorResponse(
                ex.getMessage() != null ? ex.getMessage() : "Invalid dungeon input provided",
                HttpStatus.BAD_REQUEST.value(),
                request.getDescription(false).replace("uri=", ""),
                "Bad Request"
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {

        log.warn("Illegal argument: {} at {}", ex.getMessage(), request.getDescription(false), ex);

        ErrorResponse errorResponse = new ErrorResponse(
            ex.getMessage() != null ? ex.getMessage() : "Invalid argument provided",
            HttpStatus.BAD_REQUEST.value(),
            request.getDescription(false).replace("uri=", ""),
            "Bad Request"
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException ex, WebRequest request) {

        log.warn("Invalid JSON request at {}: {}", request.getDescription(false), ex.getMessage(), ex);

        ErrorResponse errorResponse = new ErrorResponse(
            "Invalid JSON format or malformed request body",
            HttpStatus.BAD_REQUEST.value(),
            request.getDescription(false).replace("uri=", ""),
            "Bad Request"
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex, WebRequest request) {

        log.warn("Validation failed at {}: {}", request.getDescription(false), ex.getMessage(), ex);

        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .findFirst()
            .orElse("Validation failed");

        ErrorResponse errorResponse = new ErrorResponse(
            message,
            HttpStatus.BAD_REQUEST.value(),
            request.getDescription(false).replace("uri=", ""),
            "Validation Error"
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException ex, WebRequest request) {

        log.warn("Type mismatch for parameter '{}' at {}: {}", ex.getName(), request.getDescription(false), ex.getMessage(), ex);

        String message = String.format("Parameter '%s' should be of type %s",
            ex.getName(), ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown");

        ErrorResponse errorResponse = new ErrorResponse(
            message,
            HttpStatus.BAD_REQUEST.value(),
            request.getDescription(false).replace("uri=", ""),
            "Type Mismatch"
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(JsonProcessingException.class)
    public ResponseEntity<ErrorResponse> handleJsonProcessingException(
            JsonProcessingException ex, WebRequest request) {

        log.error("JSON processing error at {}: {}", request.getDescription(false), ex.getMessage(), ex);

        ErrorResponse errorResponse = new ErrorResponse(
            "Error processing JSON data",
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            request.getDescription(false).replace("uri=", ""),
            "Internal Server Error"
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(
            RuntimeException ex, WebRequest request) {

        log.error("Runtime exception at {}: {}", request.getDescription(false), ex.getMessage(), ex);

        ErrorResponse errorResponse = new ErrorResponse(
            "An unexpected error occurred",
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            request.getDescription(false).replace("uri=", ""),
            "Internal Server Error"
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, WebRequest request) {

        log.error("Unexpected exception at {}: {}", request.getDescription(false), ex.getMessage(), ex);

        ErrorResponse errorResponse = new ErrorResponse(
            "An unexpected error occurred",
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            request.getDescription(false).replace("uri=", ""),
            "Internal Server Error"
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
