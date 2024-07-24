package com.bonidev.backend.usuario.dto;

import com.bonidev.backend.usuario.entity.UsuarioEntity;
import jakarta.validation.constraints.NotBlank;

public record MostrarUsuarioDTO(
        @NotBlank
        String userName,

        @NotBlank
        String email) {
    public MostrarUsuarioDTO(UsuarioEntity user) {
        this(user.getUsername(), user.getEmail());
    }
}
