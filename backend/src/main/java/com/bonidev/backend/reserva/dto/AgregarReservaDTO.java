package com.bonidev.backend.reserva.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AgregarReservaDTO(
        @NotBlank
        String contactName,

        @NotBlank
        String contactEmail,

        @NotBlank
        String contactPhone,

        @NotBlank
        String serviceName,

        @NotNull
        LocalDateTime dateTime,

        Long barberId,

        String message,

        @NotNull
        Boolean termsAccepted,

        Boolean isActive) {

}
