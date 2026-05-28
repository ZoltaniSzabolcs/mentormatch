package com.codecrafters.mentormatch.dto.incoming;

import com.codecrafters.mentormatch.model.enums.Availability;
import com.codecrafters.mentormatch.model.enums.MentorSessionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record MentorProfileRequest(
        @NotEmpty(message = "At least one expertise area is required")
        List<String> expertise,

        @NotEmpty(message = "Availability is required")
        List<Availability> availability,

        @NotEmpty(message = "At least one session type is required")
        List<MentorSessionType> sessionTypes,

        @NotNull(message = "Capacity is required")
        @Min(value = 1, message = "Capacity must be at least 1")
        Integer capacity
) {
}
