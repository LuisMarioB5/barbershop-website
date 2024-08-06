package com.bonidev.backend.barbero.dto;

import jakarta.validation.constraints.NotBlank;

public record AgregarBarberoDTO(
        @NotBlank
        String name,

        @NotBlank
        String position,

        @NotBlank
        String description,

        String facebookLink,

        String instagramLink,

        String xLink,

        @NotBlank
        String imagePath,

        Boolean isActive) {}
