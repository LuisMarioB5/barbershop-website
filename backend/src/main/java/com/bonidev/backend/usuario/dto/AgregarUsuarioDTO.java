package com.bonidev.backend.usuario.dto;

import com.bonidev.backend.usuario.enums.Roles;
import jakarta.validation.constraints.NotBlank;

public record AgregarUsuarioDTO(
        @NotBlank
        String userName,

        @NotBlank
        String email,

        @NotBlank
        String password,

        Roles role,

        Boolean isActive) {}
