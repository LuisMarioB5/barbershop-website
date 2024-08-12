package com.bonidev.backend.reserva.controller;

import com.bonidev.backend.reserva.dto.AgregarReservaDTO;
import com.bonidev.backend.reserva.dto.MostrarReservaDTO;
import com.bonidev.backend.reserva.dto.ReservaAvailabilityDTO;
import com.bonidev.backend.reserva.service.ReservaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reservation")
public class ReservaController {

    private final ReservaService service;

    @Autowired
    public ReservaController(ReservaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<String> createReservation(@RequestBody @Valid AgregarReservaDTO reservaDTO) {
        var reserva = service.save(reservaDTO);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("{id}")
                .buildAndExpand(reserva.getId())
                .toUri();
        return ResponseEntity.created(location).body("La reserva fue almacenada satisfactoriamente.");
    }

    @GetMapping
    public ResponseEntity<List<MostrarReservaDTO>> showReservations() {
        // Obtener todas las categorías desde el servicio
        var reservations = service.findAll();

        // Transformar la lista de categorías en una lista de DTOs
        List<MostrarReservaDTO> showReservations = reservations.stream()
                .map(MostrarReservaDTO::new)
                .collect(Collectors.toList());

        // Devolver la lista de DTOs en el cuerpo de la respuesta
        return ResponseEntity.ok(showReservations);
    }

    @GetMapping("{id}")
    public ResponseEntity<MostrarReservaDTO> showReservation(@PathVariable Long id) {
        return ResponseEntity.ok(new MostrarReservaDTO(service.findById(id)));
    }

    @GetMapping("isAvailable")
    public ResponseEntity<ReservaAvailabilityDTO> checkReservation(
            @RequestParam Long barberId,
            @RequestParam String start,
            @RequestParam String end) {
        LocalDateTime startDatetime = LocalDateTime.parse(start);
        LocalDateTime endDatetime = LocalDateTime.parse(end);
        return ResponseEntity.ok(new ReservaAvailabilityDTO(!service.isBarberUnavailable(barberId, startDatetime, endDatetime)));
    }
}
