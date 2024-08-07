package com.bonidev.backend.reserva.validations;

import com.bonidev.backend.errors.ValidationException;
import com.bonidev.backend.reserva.dto.AgregarReservaDTO;
import com.bonidev.backend.reserva.repository.ReservaRepository;
import com.bonidev.backend.servicio.entity.ServicioEntity;
import com.bonidev.backend.servicio.service.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class BarberoConReserva implements ValidadorAgregarReserva {

    private final ReservaRepository repository;
    private final ServicioService servicioService;

    @Autowired
    public BarberoConReserva(ReservaRepository repository, ServicioService servicioService) {
        this.repository = repository;
        this.servicioService = servicioService;
    }

    @Override
    public void validar(AgregarReservaDTO datos) {
        if (datos.barberId() == null) return;

        ServicioEntity service = servicioService.findByNameAndIsActive(datos.serviceName());
        LocalDateTime startDateTime = datos.dateTime();
        LocalDateTime endDateTime = startDateTime.plusMinutes(service.getEstimatedTime());

        if (isBarberUnavailable(datos.barberId(), startDateTime, endDateTime)) {
            throw new ValidationException("El barbero no está disponible en el horario elegido.");
        }
    }

    private boolean isBarberUnavailable(Long barberId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        var sola = repository.findReservationsInRange(barberId, startDateTime, endDateTime);
        System.out.println("sola: " + sola);
        return !sola.isEmpty();
    }
}
