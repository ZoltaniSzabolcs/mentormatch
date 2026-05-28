package com.codecrafters.mentormatch.controller;

import com.codecrafters.mentormatch.dto.incoming.AuthRequest;
import com.codecrafters.mentormatch.dto.incoming.RegisterRequest;
import com.codecrafters.mentormatch.dto.outgoing.JwtResponse;
import com.codecrafters.mentormatch.exeption.exeptions.EmailAlreadyInUseException;
import com.codecrafters.mentormatch.model.enums.Role;
import com.codecrafters.mentormatch.model.User;
import com.codecrafters.mentormatch.repository.UserRepository;
import com.codecrafters.mentormatch.service.implementation.JwtService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<JwtResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyInUseException(request.email());
        }
        Role role = parseRole(request.role());
        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(role);
        userRepository.save(user);

        String token = jwtService.generateAccessToken(user.getEmail());
        return ResponseEntity.ok(new JwtResponse(token, role.name()));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateAndGetToken(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.email(), authRequest.password())
            );
            String role = authentication.getAuthorities().iterator().next().getAuthority();
            String token = jwtService.generateAccessToken(authRequest.email());
            return ResponseEntity.ok(new JwtResponse(token, role));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    private Role parseRole(String raw) {
        String normalized = raw == null ? "" : raw.trim();
        if (normalized.startsWith("ROLE_")) {
            normalized = normalized.substring("ROLE_".length());
        }
        return Role.valueOf(normalized);
    }

}
