package com.bonidev.backend.errors;

public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}
