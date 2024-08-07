package com.bonidev.backend.errors;

public class EntityNotAvailableException extends RuntimeException {
    public EntityNotAvailableException(String message) {
        super(message);
    }
}
