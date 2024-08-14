package com.bonidev.backend.usuario.dto;

import com.bonidev.backend.usuario.enums.Roles;

public record ModificarUsuarioDTO(
        String userName,

        String email,

        String role,

        Boolean isActive) {}
