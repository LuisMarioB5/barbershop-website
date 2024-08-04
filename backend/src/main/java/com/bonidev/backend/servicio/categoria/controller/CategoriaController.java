package com.bonidev.backend.servicio.categoria.controller;

import com.bonidev.backend.servicio.categoria.dto.MostrarCategoriaDTO;
import com.bonidev.backend.servicio.categoria.dto.AgregarCategoriaDTO;
import com.bonidev.backend.servicio.categoria.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/service/category")
public class CategoriaController {

    private final CategoriaService service;

    @Autowired
    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<String> addCategory(@RequestBody @Valid AgregarCategoriaDTO categoriaDTO) {
        var categoria = service.save(categoriaDTO);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("{id}")
                .buildAndExpand(categoria.getId())
                .toUri();
        return ResponseEntity.created(location).body("La categoria fue almacenada satisfactoriamente.");
    }

    @GetMapping("{id}")
    public ResponseEntity<MostrarCategoriaDTO> showCategory(@PathVariable Long id) {
        return ResponseEntity.ok(new MostrarCategoriaDTO(service.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<MostrarCategoriaDTO>> showCategories() {
        // Obtener todas las categorías desde el servicio
        var categories = service.findAll();

        // Transformar la lista de categorías en una lista de DTOs
        List<MostrarCategoriaDTO> showCategories = categories.stream()
                .map(MostrarCategoriaDTO::new)
                .collect(Collectors.toList());

        // Devolver la lista de DTOs en el cuerpo de la respuesta
        return ResponseEntity.ok(showCategories);
    }
}
