package com.bonidev.backend.reserva.dto;

import java.time.LocalDateTime;

public record ModificarReservaDTO(
        String contactName,

        LocalDateTime dateTime,

        Long serviceId,

        Long barberId,

        Boolean isActive) {}
