package com.bonidev.backend.reserva.validations;

import com.bonidev.backend.errors.ValidationException;
import com.bonidev.backend.reserva.dto.AgregarReservaDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class Horario implements ValidadorAgregarReserva {
    @Override
    public void validar(AgregarReservaDTO datos) {
        var now = LocalDateTime.now();
        var reservationTime = datos.dateTime();

        if (reservationTime.isBefore(now)) {
            throw new ValidationException("La fecha y hora de la reserva debe ser en el futuro.");
        }
    }
}
