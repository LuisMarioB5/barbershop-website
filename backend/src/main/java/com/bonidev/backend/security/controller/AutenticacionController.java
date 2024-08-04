package com.bonidev.backend.security.controller;

import com.bonidev.backend.usuario.entity.UsuarioEntity;
import com.bonidev.backend.security.dto.AutenticacionDTO;
import com.bonidev.backend.security.dto.JWTTokenDTO;
import com.bonidev.backend.security.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class AutenticacionController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    @Autowired
    public AutenticacionController(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping
    public ResponseEntity<JWTTokenDTO> autenticarUsuario(@RequestBody @Valid AutenticacionDTO userAuth) {
        try {
            Authentication token = new UsernamePasswordAuthenticationToken(userAuth.login(), userAuth.password());
            Authentication usuarioAuth = authenticationManager.authenticate(token);
            var JWTToken = tokenService.generarToken((UsuarioEntity) usuarioAuth.getPrincipal(), userAuth.login());
            return ResponseEntity.ok(new JWTTokenDTO(JWTToken));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
