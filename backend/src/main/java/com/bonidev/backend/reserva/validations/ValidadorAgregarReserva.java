package com.bonidev.backend.reserva.validations;


import com.bonidev.backend.reserva.dto.AgregarReservaDTO;

public interface ValidadorAgregarReserva {
    void validar(AgregarReservaDTO datos);
}
