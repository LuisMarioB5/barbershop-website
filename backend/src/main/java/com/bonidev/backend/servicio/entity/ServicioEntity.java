package com.bonidev.backend.servicio.entity;

import com.bonidev.backend.servicio.dto.agregarServicioDTO;
import com.bonidev.backend.servicio.categoria.entity.CategoriaEntity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "servicios")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class ServicioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer estimatedTime;

    @Column(nullable = false)
    private String imagePath;

    @Column(nullable = false)
    private String imageDescription;

    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    @JsonManagedReference
    private CategoriaEntity category;

    public ServicioEntity(agregarServicioDTO service, CategoriaEntity category) {
        this.name = service.name();
        this.price = service.price();
        this.estimatedTime = service.estimatedTime();
        this.imagePath = service.imagePath();
        this.imageDescription = service.imageDescription();
        this.category = category;
        this.isActive = service.isActive() == null || service.isActive();
    }
}
