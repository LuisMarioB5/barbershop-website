package com.bonidev.backend.servicio.categoria.dto;

import com.bonidev.backend.servicio.categoria.entity.CategoriaEntity;

public record MostrarCategoriaDTO(
        String name,

        String imagePath,

        String imageDescription,

        Boolean isActive) {
    public MostrarCategoriaDTO(CategoriaEntity categoria) {
        this(
                categoria.getName(),
                categoria.getImagePath(),
                categoria.getImageDescription(),
                categoria.getIsActive()
        );
    }
}
