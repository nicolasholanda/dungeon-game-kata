package com.example.dungeongamekata.exception;

import com.example.dungeongamekata.dto.ErrorResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;
    private WebRequest webRequest;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/dungeon/solve");
        webRequest = new ServletWebRequest(request);
    }

    @Test
    void handleIllegalArgumentException_ReturnsExpectedErrorResponse() {
        IllegalArgumentException exception = new IllegalArgumentException("Invalid argument");

        ResponseEntity<ErrorResponse> response = exceptionHandler.handleIllegalArgumentException(exception, webRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals("Invalid argument", errorResponse.getMessage());
        assertEquals(400, errorResponse.getStatusCode());
        assertEquals("/dungeon/solve", errorResponse.getPath());
        assertEquals("Bad Request", errorResponse.getError());
        assertNotNull(errorResponse.getTimestamp());
        assertTrue(errorResponse.getTimestamp().isBefore(LocalDateTime.now().plusSeconds(1)));
    }

    @Test
    void handleIllegalArgumentException_WithNullMessage_ReturnsDefaultMessage() {
        IllegalArgumentException exception = new IllegalArgumentException();

        ResponseEntity<ErrorResponse> response = exceptionHandler.handleIllegalArgumentException(exception, webRequest);

        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals("Invalid argument provided", errorResponse.getMessage());
    }

    @Test
    void handleHttpMessageNotReadableException_ReturnsExpectedErrorResponse() {
        HttpMessageNotReadableException exception = mock(HttpMessageNotReadableException.class);

        ResponseEntity<ErrorResponse> response = exceptionHandler.handleHttpMessageNotReadableException(exception, webRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals("Invalid JSON format or malformed request body", errorResponse.getMessage());
        assertEquals(400, errorResponse.getStatusCode());
        assertEquals("/dungeon/solve", errorResponse.getPath());
        assertEquals("Bad Request", errorResponse.getError());
    }

    @Test
    void handleMethodArgumentNotValidException_ReturnsValidationError() {
        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        FieldError fieldError = new FieldError("object", "field", "must not be null");
        
        when(exception.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError));

        ResponseEntity<ErrorResponse> response = exceptionHandler.handleMethodArgumentNotValidException(exception, webRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals("field: must not be null", errorResponse.getMessage());
        assertEquals("Validation Error", errorResponse.getError());
    }

    @Test
    void handleMethodArgumentTypeMismatchException_ReturnsTypeMismatchError() {
        MethodArgumentTypeMismatchException exception = mock(MethodArgumentTypeMismatchException.class);
        when(exception.getName()).thenReturn("paramName");
        when(exception.getRequiredType()).thenReturn((Class) Integer.class);

        ResponseEntity<ErrorResponse> response = exceptionHandler.handleMethodArgumentTypeMismatchException(exception, webRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals("Parameter 'paramName' should be of type Integer", errorResponse.getMessage());
        assertEquals("Type Mismatch", errorResponse.getError());
    }

    @Test
    void handleJsonProcessingException_ReturnsInternalServerError() {
        JsonProcessingException exception = mock(JsonProcessingException.class);

        ResponseEntity<ErrorResponse> response = exceptionHandler.handleJsonProcessingException(exception, webRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals("Error processing JSON data", errorResponse.getMessage());
        assertEquals(500, errorResponse.getStatusCode());
        assertEquals("Internal Server Error", errorResponse.getError());
    }

    @Test
    void handleRuntimeException_ReturnsInternalServerError() {
        RuntimeException exception = new RuntimeException("Unexpected runtime error");

        ResponseEntity<ErrorResponse> response = exceptionHandler.handleRuntimeException(exception, webRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals("An unexpected error occurred", errorResponse.getMessage());
        assertEquals(500, errorResponse.getStatusCode());
        assertEquals("Internal Server Error", errorResponse.getError());
    }

    @Test
    void handleGenericException_ReturnsInternalServerError() {
        Exception exception = new Exception("Generic error");

        ResponseEntity<ErrorResponse> response = exceptionHandler.handleGenericException(exception, webRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals("An unexpected error occurred", errorResponse.getMessage());
        assertEquals(500, errorResponse.getStatusCode());
        assertEquals("Internal Server Error", errorResponse.getError());
    }
}
