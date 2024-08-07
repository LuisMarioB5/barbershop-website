package com.bonidev.backend.servicio.service;

import com.bonidev.backend.errors.EntityNotActiveException;
import com.bonidev.backend.servicio.categoria.entity.CategoriaEntity;
import com.bonidev.backend.servicio.categoria.service.CategoriaService;
import com.bonidev.backend.servicio.dto.agregarServicioDTO;
import com.bonidev.backend.servicio.entity.ServicioEntity;
import com.bonidev.backend.servicio.repository.ServicioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ServicioService {

    private final ServicioRepository repository;
    private final CategoriaService categoriaService;

    @Autowired
    public ServicioService(ServicioRepository repository, CategoriaService categoriaService) {
        this.repository = repository;
        this.categoriaService = categoriaService;
    }

    public ServicioEntity save(@Valid agregarServicioDTO service) {
        CategoriaEntity category = categoriaService.findByName(service.category());
        return repository.save(new ServicioEntity(service, category));
    }

    public ServicioEntity findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Servicio con el id: " + id + " no fue encontrado..."));
    }

    public List<ServicioEntity> findAll() {
        return repository.findAll();
    }

    public ServicioEntity findByName(String name) {
        return repository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Servicio con el nombre: " + name + " no fue encontrado..."));
    }

    public ServicioEntity findByNameAndIsActive(String name) {
        ServicioEntity servicio = findByName(name);
        if (servicio.getIsActive()) {
            return servicio;
        }
        throw new EntityNotActiveException("Servicio con el nombre: " + name + " no esta activo...");
    }
}
