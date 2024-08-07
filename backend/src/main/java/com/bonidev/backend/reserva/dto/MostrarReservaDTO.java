package com.bonidev.backend.reserva.dto;

import com.bonidev.backend.barbero.entity.BarberoEntity;
import com.bonidev.backend.reserva.entity.ReservaEntity;
import com.bonidev.backend.servicio.entity.ServicioEntity;

import java.time.LocalDateTime;

public record MostrarReservaDTO(
        Long id,

        String contactName,

        String contactEmail,

        String contactPhone,

        ServicioEntity service,

        LocalDateTime startDateTime,

        LocalDateTime endDateTime,

        BarberoEntity barber,

        String message,

        Boolean termsAccepted,

        Boolean isActive) {
    public MostrarReservaDTO(ReservaEntity reserva) {
        this(
                reserva.getId(),
                reserva.getContactName(),
                reserva.getContactEmail(),
                reserva.getContactPhone(),
                reserva.getService(),
                reserva.getStartDateTime(),
                reserva.getEndDateTime(),
                reserva.getBarber(),
                reserva.getMessage(),
                reserva.getTermsAccepted(),
                reserva.getIsActive()
        );
    }
}
