package com.bonidev.backend.usuario.controller;

import com.bonidev.backend.usuario.dto.AgregarUsuarioDTO;
import com.bonidev.backend.usuario.dto.ModificarClaveDTO;
import com.bonidev.backend.usuario.entity.UsuarioEntity;
import com.bonidev.backend.usuario.dto.MostrarUsuarioDTO;
import com.bonidev.backend.usuario.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/user")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<String> addUser(@RequestBody @Valid AgregarUsuarioDTO user) {
        UsuarioEntity userEntity = usuarioService.save(user);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(userEntity.getId())
                .toUri();
        return ResponseEntity.created(location).body("El usuario fue almacenado satisfactoriamente.");
    }

    @GetMapping("/{id}")
    public ResponseEntity<MostrarUsuarioDTO> showUser(@PathVariable Long id) {
        UsuarioEntity user = usuarioService.findById(id);
        return ResponseEntity.ok(new MostrarUsuarioDTO(user));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}/change-password")
    public ResponseEntity<String> resetPassword(@PathVariable Long id, @RequestBody @Validated ModificarClaveDTO dto) {
        usuarioService.changePassword(id, dto.newPassword());
        return ResponseEntity.ok("Contraseña actualizada correctamente...");
    }
}
