package com.bonidev.backend.servicio.controller;

import com.bonidev.backend.servicio.categoria.dto.MostrarCategoriaDTO;
import com.bonidev.backend.servicio.dto.MostrarServicioDTO;
import com.bonidev.backend.servicio.dto.agregarServicioDTO;
import com.bonidev.backend.servicio.service.ServicioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/service")
public class ServicioController {

    private final ServicioService service;

    @Autowired
    public ServicioController(ServicioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<String> addService(@RequestBody @Valid agregarServicioDTO serviceDTO) {
        var servicio = service.save(serviceDTO);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(servicio.getId())
                .toUri();
        return ResponseEntity.created(location).body("El servicio fue almacenado satisfactoriamente.");
    }

    @GetMapping("/{id}")
    public ResponseEntity<MostrarServicioDTO> showService(@PathVariable Long id) {
        return ResponseEntity.ok(new MostrarServicioDTO(service.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<MostrarServicioDTO>> showServices() {
        // Obtener todas los servicios desde el servicio
        var services = service.findAll();

        // Transformar la lista de servicios en una lista de DTOs
        List<MostrarServicioDTO> showServices = services.stream()
                .map(MostrarServicioDTO::new)
                .collect(Collectors.toList());

        // Devolver la lista de DTOs en el cuerpo de la respuesta
        return ResponseEntity.ok(showServices);
    }
}
