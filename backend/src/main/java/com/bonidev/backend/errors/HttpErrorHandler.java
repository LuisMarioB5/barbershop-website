package com.bonidev.backend.errors;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

@RestControllerAdvice
public class HttpErrorHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> errorEntityNotFoundException(EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<String> errorValidationException(ValidationException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> errorResourceNotFoundException(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<?> error400(HandlerMethodValidationException e) {
        var errors = e.getAllErrors().stream()
                .map(error -> {
                    if (error instanceof FieldError fieldError) {
                        return new DatosErrorValidacion(fieldError.getField(), fieldError.getDefaultMessage());
                    }
                    return new DatosErrorValidacion("unknown", error.getDefaultMessage());
                })
                .toList();

        return ResponseEntity.badRequest().body(errors);
    }

    private record DatosErrorValidacion(String campo, String mensajeError) {
        public DatosErrorValidacion(String campo, String mensajeError) {
            this.campo = campo;
            this.mensajeError = mensajeError;
        }
    }
}
