package com.bonidev.backend.servicio.categoria.dto;

import jakarta.validation.constraints.NotBlank;

public record AgregarCategoriaDTO(
        @NotBlank
        String name,

        @NotBlank
        String imagePath,

        @NotBlank
        String imageDescription,

        Boolean isActive) {}
