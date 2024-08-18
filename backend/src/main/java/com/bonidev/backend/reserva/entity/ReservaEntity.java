package com.bonidev.backend.reserva.entity;

import com.bonidev.backend.barbero.entity.BarberoEntity;
import com.bonidev.backend.servicio.entity.ServicioEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class ReservaEntity {
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contact_name", nullable = false)
    private String contactName;

    @Column(name = "contact_email", nullable = false)
    private String contactEmail;

    @Column(name = "contact_phone", nullable = false)
    private String contactPhone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "servicio_id", nullable = false)
    private ServicioEntity service;

    @Column(name = "start_date_time", nullable = false)
    private LocalDateTime startDateTime;

    @Column(name = "end_date_time", nullable = false)
    private LocalDateTime endDateTime;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "barbero_id", nullable = false)
    private BarberoEntity barber;

    private String message;

    @Column(name = "terms_accepted", nullable = false)
    private Boolean termsAccepted;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
