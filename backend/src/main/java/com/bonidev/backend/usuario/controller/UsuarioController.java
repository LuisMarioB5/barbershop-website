package com.bonidev.backend.usuario.controller;

import com.bonidev.backend.usuario.dto.AgregarUsuarioDTO;
import com.bonidev.backend.usuario.dto.ModificarClaveDTO;
import com.bonidev.backend.usuario.entity.UsuarioEntity;
import com.bonidev.backend.usuario.dto.MostrarUsuarioDTO;
import com.bonidev.backend.usuario.enums.Roles;
import com.bonidev.backend.usuario.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.management.relation.Role;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

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
        return ResponseEntity.ok(new MostrarUsuarioDTO(usuarioService.findById(id)));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<MostrarUsuarioDTO>> showUsers() {
        List<MostrarUsuarioDTO> usersDTO = usuarioService.findAll().stream()
                .map(MostrarUsuarioDTO::new)
                .toList();
        return ResponseEntity.ok(usersDTO);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("roles")
    public ResponseEntity<Roles[]> showUserRoles() {
        return ResponseEntity.ok(Roles.values());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}/change-password")
    public ResponseEntity<String> resetPassword(@PathVariable Long id, @RequestBody @Validated ModificarClaveDTO dto) {
        usuarioService.changePassword(id, dto.newPassword());
        return ResponseEntity.ok("Contraseña actualizada correctamente...");
    }
}
