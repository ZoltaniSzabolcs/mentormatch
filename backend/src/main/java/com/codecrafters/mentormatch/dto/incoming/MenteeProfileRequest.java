package com.codecrafters.mentormatch.dto.incoming;

import com.codecrafters.mentormatch.model.enums.Availability;
import com.codecrafters.mentormatch.model.enums.ExperienceLevel;
import com.codecrafters.mentormatch.model.enums.LearningStyle;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record MenteeProfileRequest(
        @NotNull(message = "Experience level is required")
        ExperienceLevel experienceLevel,

        @NotNull(message = "Learning style is required")
        LearningStyle learningStyle,

        @NotNull(message = "Availability is required")
        Availability availability,

        @NotEmpty(message = "At least one learning goal is required")
        List<String> goals
) {
}
