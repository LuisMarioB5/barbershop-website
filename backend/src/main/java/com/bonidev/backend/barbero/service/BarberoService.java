package com.bonidev.backend.barbero.service;

import com.bonidev.backend.barbero.dto.AgregarBarberoDTO;
import com.bonidev.backend.barbero.entity.BarberoEntity;
import com.bonidev.backend.barbero.repository.BarberoRepository;
import com.bonidev.backend.errors.EntityNotActiveException;
import com.bonidev.backend.errors.EntityNotAvailableException;
import com.bonidev.backend.reserva.repository.ReservaRepository;
import com.bonidev.backend.reserva.service.ReservaService;
import com.bonidev.backend.servicio.entity.ServicioEntity;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class BarberoService {

    private final BarberoRepository repository;
    private final ReservaRepository reservaRepository;

    @Autowired
    public BarberoService(BarberoRepository repository, ReservaRepository reservaRepository) {
        this.repository = repository;
        this.reservaRepository = reservaRepository;
    }

    public BarberoEntity save(@Valid AgregarBarberoDTO barber) {
        return repository.save(new BarberoEntity(barber));
    }

    public BarberoEntity findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Barbero con el id: " + id + " no fue encontrado..."));
    }

    public BarberoEntity findByIdAndIsActive(Long id) {
        BarberoEntity barbero = findById(id);
        if (barbero.getIsActive()) {
            return barbero;
        }
        throw new EntityNotActiveException("Barbero con el id: " + id + " no esta activo...");
    }

    public List<BarberoEntity> findAll() {
        return repository.findAll();
    }

    public BarberoEntity getRandomActiveAndAvailableBarber(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        List<BarberoEntity> allActiveBarbers = repository.findAllActiveBarbers();
        List<BarberoEntity> availableBarbers = new ArrayList<>();

        for (BarberoEntity barber : allActiveBarbers) {
            boolean isAvailable = reservaRepository.findReservationsInRange(barber.getId(), startDateTime, endDateTime).stream()
                    .noneMatch(reserva -> (reserva.getStartDateTime().isBefore(endDateTime) && startDateTime.isBefore(reserva.getEndDateTime())));

            if (isAvailable) {
                availableBarbers.add(barber);
            }
        }

        if (availableBarbers.isEmpty()) {
            throw new EntityNotAvailableException("No se encontró ningún barbero disponible");
        }

        Random random = new Random();
        int randomIndex = random.nextInt(availableBarbers.size());
        return availableBarbers.get(randomIndex);
    }
}
