package com.bonidev.backend.servicio.repository;

import com.bonidev.backend.servicio.entity.ServicioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServicioRepository extends JpaRepository<ServicioEntity, Long> {
    Optional<ServicioEntity> findByName(String name);
}
