package com.bonidev.backend.barbero.dto;

import com.bonidev.backend.barbero.entity.BarberoEntity;

public record MostrarBarberoDTO(
        Long id,

        String name,

        String position,

        String description,

        String facebookLink,

        String instagramLink,

        String xLink,

        String imagePath,

        Boolean isActive) {
    public MostrarBarberoDTO(BarberoEntity barber) {
        this(
                barber.getId(),
                barber.getName(),
                barber.getPosition(),
                barber.getDescription(),
                barber.getFacebookLink(),
                barber.getInstagramLink(),
                barber.getXLink(),
                barber.getImagePath(),
                barber.getIsActive()
        );
    }
}
