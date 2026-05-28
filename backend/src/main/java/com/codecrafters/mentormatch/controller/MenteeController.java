package com.codecrafters.mentormatch.controller;

import com.codecrafters.mentormatch.dto.MenteeResponseDTO;
import com.codecrafters.mentormatch.dto.incoming.MenteeProfileRequest;
import com.codecrafters.mentormatch.model.MenteeProfile;
import com.codecrafters.mentormatch.model.User;
import com.codecrafters.mentormatch.repository.MenteeProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.codecrafters.mentormatch.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mentees")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class MenteeController {
    private static final Logger logger = LoggerFactory.getLogger(MenteeController.class);

    private final MenteeProfileRepository menteeProfileRepository;
    private final UserRepository userRepository;

    @GetMapping
    @Transactional
    public ResponseEntity<List<MenteeResponseDTO>> getAllMentees() {
        try {
            List<MenteeProfile> profiles = menteeProfileRepository.findAll();
            logger.info("Found {} mentees", profiles.size());

            List<MenteeResponseDTO> response = profiles.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching mentees", e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<MenteeResponseDTO> getMenteeById(@PathVariable Long id) {
        try {
            return menteeProfileRepository.findById(id)
                    .map(this::convertToDTO)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching mentee with id {}", id, e);
            throw e;
        }
    }

    @GetMapping("/me")
    @Transactional
    public ResponseEntity<MenteeResponseDTO> getCurrentMentee() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getName() == null) {
                return ResponseEntity.status(401).build();
            }

            return menteeProfileRepository.findByUserEmail(auth.getName())
                    .map(this::convertToDTO)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching current mentee profile", e);
            throw e;
        }
    }

    @PostMapping("/profile")
    @Transactional
    public ResponseEntity<Void> saveMenteeProfile(@Valid @RequestBody MenteeProfileRequest request,
                                                  Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        MenteeProfile profile = menteeProfileRepository.findById(user.getId())
                .orElseGet(MenteeProfile::new);
        profile.setUser(user);
        profile.setExperienceLevel(request.experienceLevel());
        profile.setLearningStyle(request.learningStyle());
        profile.setAvailability(request.availability());
        profile.setGoals(request.goals());

        menteeProfileRepository.save(profile);
        return ResponseEntity.ok().build();
    }

    // Helper method to map Entity -> DTO
    private MenteeResponseDTO convertToDTO(MenteeProfile profile) {
        MenteeResponseDTO dto = new MenteeResponseDTO();
        dto.setId(profile.getId());

        if (profile.getUser() != null) {
            dto.setName(profile.getUser().getName());
            dto.setEmail(profile.getUser().getEmail());
            dto.setTitle(profile.getUser().getTitle());
            dto.setCompany(profile.getUser().getCompany());
            dto.setRating(profile.getUser().getRating());
            dto.setReviewCount(profile.getUser().getReviewCount());
        }

        dto.setExperienceLevel(profile.getExperienceLevel().name());
        dto.setLearningStyle(profile.getLearningStyle().name());
        dto.setAvailability(profile.getAvailability().name());

        // Eagerly initialize lazy collection before transaction closes
        if (profile.getGoals() != null) {
            Hibernate.initialize(profile.getGoals());
            dto.setGoals(profile.getGoals());
        }

        return dto;
    }
}
