package com.bonidev.backend.reserva.service;

import com.bonidev.backend.barbero.entity.BarberoEntity;
import com.bonidev.backend.barbero.service.BarberoService;
import com.bonidev.backend.reserva.dto.AgregarReservaDTO;
import com.bonidev.backend.reserva.entity.ReservaEntity;
import com.bonidev.backend.reserva.repository.ReservaRepository;
import com.bonidev.backend.reserva.validations.ValidadorAgregarReserva;
import com.bonidev.backend.servicio.entity.ServicioEntity;
import com.bonidev.backend.servicio.service.ServicioService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ReservaService {

    private final ReservaRepository repository;
    private final ServicioService servicioService;
    private final BarberoService barberoService;
    private final List<ValidadorAgregarReserva> validadoresAgregarReserva;

    @Autowired
    public ReservaService(ReservaRepository repository, ServicioService servicioService, BarberoService barberoService, List<ValidadorAgregarReserva> validadoresAgregarReserva) {
        this.repository = repository;
        this.servicioService = servicioService;
        this.barberoService = barberoService;
        this.validadoresAgregarReserva = validadoresAgregarReserva;
    }

    public ReservaEntity save(@Valid AgregarReservaDTO reservation) {
        validadoresAgregarReserva.forEach(validador -> validador.validar(reservation));

        ReservaEntity reserva = new ReservaEntity();
        reserva.setContactName(reservation.contactName());
        reserva.setContactEmail(reservation.contactEmail());
        reserva.setContactPhone(reservation.contactPhone());
        reserva.setService(servicioService.findByNameAndIsActive(reservation.serviceName()));
        reserva.setStartDateTime(reservation.dateTime());
        reserva.setEndDateTime(reservation.dateTime().plusMinutes(reserva.getService().getEstimatedTime()));
        reserva.setBarber(getBarberForReservation(reservation));
        reserva.setMessage(reservation.message());
        reserva.setTermsAccepted(reservation.termsAccepted());
        reserva.setIsActive(reservation.isActive() == null || reservation.isActive());
        return repository.save(reserva);
    }

    private BarberoEntity getBarberForReservation(AgregarReservaDTO reservation) {
        ServicioEntity service = servicioService.findByNameAndIsActive(reservation.serviceName());
        LocalDateTime startDateTime = reservation.dateTime();
        LocalDateTime endDateTime = startDateTime.plusMinutes(service.getEstimatedTime());

        return reservation.barberId() == null ? barberoService.getRandomActiveAndAvailableBarber(startDateTime, endDateTime) : barberoService.findByIdAndIsActive(reservation.barberId());
    }

    public ReservaEntity findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reserva con el id: " + id + " no fue encontrada..."));
    }

    public List<ReservaEntity> findAll() {
        return repository.findAll();
    }
}
