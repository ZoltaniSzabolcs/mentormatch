package com.codecrafters.mentormatch.dto.incoming;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "The name cannot be left blank")
        @Size(min = 2, max = 50, message = "The name must be between 2 and 50 characters long")
        String name,

        @NotBlank(message = "The email field cannot be left blank")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "The password cannot be blank")
        @Size(min = 8, max = 30, message = "The password must be between 8 and 30 characters long")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$",
                message = "Your password must include at least one lowercase letter, one uppercase letter, one number, and one special character (@#$%^&+=)"
        )
        String password,

        @NotBlank(message = "The role cannot be left blank")
        @Pattern(
                regexp = "^(MENTOR|MENTEE|ADMIN)$",
                message = "Role must be either MENTOR, MENTEE, or ADMIN"
        )
        String role

) {
}
