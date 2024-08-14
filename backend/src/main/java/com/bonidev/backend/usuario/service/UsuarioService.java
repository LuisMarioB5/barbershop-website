package com.bonidev.backend.usuario.service;

import com.bonidev.backend.usuario.dto.AgregarUsuarioDTO;
import com.bonidev.backend.usuario.dto.ModificarUsuarioDTO;
import com.bonidev.backend.usuario.entity.UsuarioEntity;
import com.bonidev.backend.usuario.enums.Roles;
import com.bonidev.backend.usuario.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public UsuarioEntity save(@Valid AgregarUsuarioDTO dto) {
        // Asignar ROLE_USER por defecto si el rol no se proporciona
        Roles role = dto.role() == null ? Roles.ROLE_USER : dto.role();

        // Codificar la contraseña con bcrypt
        String password = passwordEncoder.encode(dto.password());

        Boolean isActive = dto.isActive() == null || dto.isActive();

        // Crear y guardar la entidad UsuarioEntity
        UsuarioEntity user = new UsuarioEntity(dto.userName(), dto.email(), password, role, isActive);
        return repository.save(user);
    }

    public UsuarioEntity findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario con el id: " + id + " no fue encontrado..."));
    }

    public List<UsuarioEntity> findAll() {
        return repository.findAll();
    }

    public void changePassword(Long id, String newPassword) {
        UsuarioEntity user = findById(id);
        user.setPassword(passwordEncoder.encode(newPassword));
        repository.save(user);
    }

    public void updateUser(Long id, ModificarUsuarioDTO dto) {
        // Buscar usuario por ID
        UsuarioEntity usuario = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El usuario con id: " + id + " no fue encontrado"));

        // Actualizar datos del usuario
        usuario.setNombreUsuario(dto.userName());
        usuario.setEmail(dto.email());
        usuario.setRole(Roles.parseStr(dto.role()));
        usuario.setIsActive(dto.isActive());

        // Guardar los cambios en el repositorio
        repository.save(usuario);
    }
}
