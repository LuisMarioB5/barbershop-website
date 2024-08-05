package com.bonidev.backend.servicio.categoria.dto;

import com.bonidev.backend.servicio.categoria.entity.CategoriaEntity;

public record MostrarCategoriaDTO(
        Long id,

        String name,

        String imagePath,

        String imageDescription,

        Boolean isActive) {
    public MostrarCategoriaDTO(CategoriaEntity category) {
        this(
                category.getId(),
                category.getName(),
                category.getImagePath(),
                category.getImageDescription(),
                category.getIsActive()
        );
    }
}
