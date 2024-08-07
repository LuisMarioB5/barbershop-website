package com.bonidev.backend.reserva.validations;

import com.bonidev.backend.errors.ValidationException;
import com.bonidev.backend.reserva.dto.AgregarReservaDTO;
import org.springframework.stereotype.Component;

@Component
public class TerminosYCondiciones implements ValidadorAgregarReserva {

    @Override
    public void validar(AgregarReservaDTO datos) {
        boolean reservationTerms = datos.termsAccepted();

        if (!reservationTerms) {
            throw new ValidationException("Se deben aceptar los términos y condiciones, para agendar una reserva.");
        }
    }
}
