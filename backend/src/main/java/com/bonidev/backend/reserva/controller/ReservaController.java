package com.bonidev.backend.reserva.controller;

import com.bonidev.backend.barbero.entity.BarberoEntity;
import com.bonidev.backend.barbero.service.BarberoService;
import com.bonidev.backend.reserva.dto.AgregarReservaDTO;
import com.bonidev.backend.reserva.dto.ModificarReservaDTO;
import com.bonidev.backend.reserva.dto.MostrarReservaDTO;
import com.bonidev.backend.reserva.dto.ReservaAvailabilityDTO;
import com.bonidev.backend.reserva.service.ReservaService;
import com.bonidev.backend.usuario.dto.ModificarUsuarioDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reservation")
public class ReservaController {

    private final ReservaService service;
    private final BarberoService barberoService;

    @Autowired
    public ReservaController(ReservaService service, BarberoService barberoService) {
        this.service = service;
        this.barberoService = barberoService;
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
            @RequestParam String barberId,
            @RequestParam String start,
            @RequestParam String end) {
        LocalDateTime startDatetime = LocalDateTime.parse(start);
        LocalDateTime endDatetime = LocalDateTime.parse(end);

        String id = barberId;
        if (Objects.equals(id, "null")){
            BarberoEntity barber = barberoService.getRandomActiveAndAvailableBarber(startDatetime, endDatetime);
            id = barber.getId().toString();
        }

        Long barberIdLong = Long.parseLong(id, 10);
        return ResponseEntity.ok(new ReservaAvailabilityDTO(barberIdLong, !service.isBarberUnavailable(barberIdLong, startDatetime, endDatetime)));
    }

    @PutMapping("{id}")
    public ResponseEntity<String> updateReservation(@PathVariable Long id, @RequestBody ModificarReservaDTO dto) {
        service.updateReservation(id, dto);
        return ResponseEntity.ok("Datos de la reserva actualizados correctamente...");
    }
}
