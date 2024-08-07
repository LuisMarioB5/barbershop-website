package com.bonidev.backend.reserva.repository;

import com.bonidev.backend.barbero.entity.BarberoEntity;
import com.bonidev.backend.reserva.entity.ReservaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<ReservaEntity, Long> {
    @Query("SELECT r FROM ReservaEntity r WHERE r.barber.id = :barberId AND " +
            "((:startDateTime < r.endDateTime) AND (r.startDateTime < :endDateTime))")
    List<ReservaEntity> findReservationsInRange(@Param("barberId") Long barberId,
                                                @Param("startDateTime") LocalDateTime startDateTime,
                                                @Param("endDateTime") LocalDateTime endDateTime);

}