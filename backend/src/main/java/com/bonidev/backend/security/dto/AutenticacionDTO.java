package com.bonidev.backend.security.dto;

import jakarta.validation.constraints.NotBlank;

public record AutenticacionDTO(
        @NotBlank
        String login,

        @NotBlank
        String password) {}
