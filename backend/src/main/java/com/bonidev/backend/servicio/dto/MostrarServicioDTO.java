package com.bonidev.backend.servicio.dto;

import com.bonidev.backend.servicio.categoria.entity.CategoriaEntity;
import com.bonidev.backend.servicio.entity.ServicioEntity;

import java.math.BigDecimal;

public record MostrarServicioDTO(
        String name,

        BigDecimal price,

        Integer estimatedTime,

        String imagePath,

        String imageDescription,

        CategoriaEntity category,

        Boolean isActive) {
    public MostrarServicioDTO(ServicioEntity service) {
        this(
                service.getName(),
                service.getPrice(),
                service.getEstimatedTime(),
                service.getImagePath(),
                service.getImageDescription(),
                service.getCategory(),
                service.getIsActive()
        );
    }
}
