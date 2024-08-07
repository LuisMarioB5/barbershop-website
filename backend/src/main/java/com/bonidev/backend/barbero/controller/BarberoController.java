package com.bonidev.backend.barbero.controller;

import com.bonidev.backend.barbero.dto.AgregarBarberoDTO;
import com.bonidev.backend.barbero.dto.MostrarBarberoDTO;
import com.bonidev.backend.barbero.service.BarberoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/barber")
public class BarberoController {

    private final BarberoService service;

    @Autowired
    public BarberoController(BarberoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<String> addBarber(@RequestBody @Valid AgregarBarberoDTO barberoDTO) {
        var barbero = service.save(barberoDTO);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("{id}")
                .buildAndExpand(barbero.getId())
                .toUri();
        return ResponseEntity.created(location).body("El barbero fue almacenado satisfactoriamente.");
    }

    @GetMapping("{id}")
    public ResponseEntity<MostrarBarberoDTO> showBarber(@PathVariable Long id) {
        return ResponseEntity.ok(new MostrarBarberoDTO(service.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<MostrarBarberoDTO>> showBarbers() {
        // Obtener todos los barberos desde el servicio
        var barbers = service.findAll();

        // Transformar la lista de barberos en una lista de DTOs
        List<MostrarBarberoDTO> showBarbers = barbers.stream()
                .map(MostrarBarberoDTO::new)
                .collect(Collectors.toList());

        // Devolver la lista de DTOs en el cuerpo de la respuesta
        return ResponseEntity.ok(showBarbers);
    }
}
