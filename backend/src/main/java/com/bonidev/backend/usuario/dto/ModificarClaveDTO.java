package com.bonidev.backend.usuario.dto;

import jakarta.validation.constraints.NotBlank;

public record ModificarClaveDTO(
        @NotBlank
        String newPassword) {
    public ModificarClaveDTO(@NotBlank String newPassword) {
        this.newPassword = newPassword;
    }
}
