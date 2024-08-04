package com.bonidev.backend.servicio.categoria.entity;

import com.bonidev.backend.servicio.categoria.dto.AgregarCategoriaDTO;
import com.bonidev.backend.servicio.entity.ServicioEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categorias")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class CategoriaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String imagePath;

    @Column(nullable = false)
    private String imageDescription;

    private Boolean isActive;

     @OneToMany(mappedBy = "category")
     @JsonBackReference
     private List<ServicioEntity> services = new ArrayList<>();

    public CategoriaEntity(AgregarCategoriaDTO category) {
        this.name = category.name();
        this.imagePath = category.imagePath();
        this.imageDescription = category.imageDescription();
        this.isActive = category.isActive() == null || category.isActive();
    }
}
