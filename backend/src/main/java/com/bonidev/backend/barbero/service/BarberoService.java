package com.bonidev.backend.barbero.service;

import com.bonidev.backend.barbero.dto.AgregarBarberoDTO;
import com.bonidev.backend.barbero.entity.BarberoEntity;
import com.bonidev.backend.barbero.repository.BarberoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class BarberoService {

    private final BarberoRepository repository;

    @Autowired
    public BarberoService(BarberoRepository repository) {
        this.repository = repository;
    }

    public BarberoEntity save(@Valid AgregarBarberoDTO barber) {
        return repository.save(new BarberoEntity(barber));
    }

    public BarberoEntity findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Barbero con el id: " + id + " no fue encontrado..."));
    }

    public List<BarberoEntity> findAll() {
        return repository.findAll();
    }
}
