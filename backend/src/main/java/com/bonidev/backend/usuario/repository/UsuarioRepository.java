package com.bonidev.backend.usuario.repository;

import com.bonidev.backend.usuario.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long> {
    Optional<UserDetails> findByEmailOrNombreUsuario(String subject, String subject1);
}
