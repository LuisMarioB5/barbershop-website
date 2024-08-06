package com.bonidev.backend.barbero.entity;

import com.bonidev.backend.barbero.dto.AgregarBarberoDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "barberos")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class BarberoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String position;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String facebookLink;

    @Column(nullable = false)
    private String instagramLink;

    @Column(nullable = false)
    private String xLink;

    @Column(nullable = false, unique = true)
    private String imagePath;

    private Boolean isActive;

    public BarberoEntity(AgregarBarberoDTO barber) {
        this.name = barber.name();
        this.position = barber.position();
        this.description = barber.description();
        this.facebookLink = barber.facebookLink() == null ? "https://www.facebook.com/" : barber.facebookLink();
        this.instagramLink = barber.instagramLink() == null ? "https://www.instagram.com/" : barber.instagramLink();
        this.xLink = barber.xLink() == null ? "https://www.x.com/" : barber.xLink();
        this.imagePath = barber.imagePath();
        this.isActive = barber.isActive() == null || barber.isActive();
    }
}
