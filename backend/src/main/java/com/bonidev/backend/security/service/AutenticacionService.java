package com.bonidev.backend.security.service;

import com.bonidev.backend.errors.ResourceNotFoundException;
import com.bonidev.backend.usuario.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AutenticacionService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public AutenticacionService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        return usuarioRepository.findByEmailOrNombreUsuario(identifier, identifier)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + identifier));
    }
}
