package com.codecrafters.mentormatch.dto.outgoing;

public record JwtResponse(
        String token,
        String role
) { }
