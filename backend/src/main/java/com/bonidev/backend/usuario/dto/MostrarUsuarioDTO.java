package com.bonidev.backend.usuario.dto;

import com.bonidev.backend.usuario.entity.UsuarioEntity;
import com.bonidev.backend.usuario.enums.Roles;
import jakarta.validation.constraints.NotBlank;

public record MostrarUsuarioDTO(
        Long id,

        @NotBlank
        String userName,

        @NotBlank
        String email,

        Roles role,

        Boolean isActive) {
    public MostrarUsuarioDTO(UsuarioEntity user) {
        this(user.getId(), user.getUsername(), user.getEmail(), user.getRole(), user.getIsActive());
    }
}
