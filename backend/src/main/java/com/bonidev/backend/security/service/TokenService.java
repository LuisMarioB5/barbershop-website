package com.bonidev.backend.security.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.bonidev.backend.errors.ValidationException;
import com.bonidev.backend.usuario.entity.UsuarioEntity;
import com.bonidev.backend.usuario.enums.Roles;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    private final String JWT_SECRET = System.getenv("JWT_SECRET");
    private final Algorithm algorithm = Algorithm.HMAC256(JWT_SECRET);

    public String generarToken(UsuarioEntity usuario, String login) {
        try {
            return JWT.create()
                    .withIssuer("Barbería backend")
                    .withSubject(login)
                    .withClaim("id", usuario.getId())
                    .withClaim("role", usuario.getAuthorities().stream().findFirst().map(GrantedAuthority::getAuthority).orElse(Roles.ROLE_USER.toString()))
                    .withClaim("email", usuario.getEmail())
                    .withExpiresAt(generarFechaExpiracion())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new ValidationException(exception.getMessage());
        }
    }

    private Instant generarFechaExpiracion() {
        return LocalDateTime.now().plusHours(5).toInstant(ZoneOffset.of("-04:00"));
    }

    public DecodedJWT getAllClaims(String token) {
        if (token == null) throw new ValidationException("El token no puede ser nulo.");
        if (token.isBlank()) throw new ValidationException("El token no puede estar vacío.");

        try {
            return JWT.require(algorithm)
                    .withIssuer("Barbería backend")
                    .build()
                    .verify(token);
        } catch (JWTVerificationException exception) {
            throw new ValidationException(exception.getMessage());
        }
    }

    public String getSubject(String token) {
        return getAllClaims(token).getSubject();
    }

    public String getRole(String token) {
        return getAllClaims(token).getClaim("role").asString();
    }

    public Long getUserId(String token) {
        return getAllClaims(token).getClaim("id").asLong();
    }
}
