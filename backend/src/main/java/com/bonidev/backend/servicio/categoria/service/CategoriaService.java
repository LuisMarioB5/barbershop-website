package com.bonidev.backend.servicio.categoria.service;

import com.bonidev.backend.servicio.categoria.dto.AgregarCategoriaDTO;
import com.bonidev.backend.servicio.categoria.entity.CategoriaEntity;
import com.bonidev.backend.servicio.categoria.repository.CategoriaRepository;
import com.bonidev.backend.servicio.entity.ServicioEntity;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CategoriaService {

    private final CategoriaRepository repository;

    @Autowired
    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    public CategoriaEntity save(@Valid AgregarCategoriaDTO category) {
        return repository.save(new CategoriaEntity(category));
    }

    public CategoriaEntity findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoria con el id: " + id + " no fue encontrado..."));
    }

    public List<CategoriaEntity> findAll() {
        return repository.findAll();
    }

    public CategoriaEntity findByName(String name) {
        return repository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Categoria con el nombre: " + name + " no fue encontrado..."));
    }
}
