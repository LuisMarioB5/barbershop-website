package com.bonidev.backend.servicio.dto;

import com.bonidev.backend.servicio.categoria.entity.CategoriaEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record agregarServicioDTO(
        @NotBlank
        String name,

        @NotNull
        BigDecimal price,

        @NotNull
        Integer estimatedTime,

        @NotBlank
        String imagePath,

        @NotBlank
        String imageDescription,

        @NotNull
        String category,

        Boolean isActive) {}
