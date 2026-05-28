package com.codecrafters.mentormatch.controller;

import com.codecrafters.mentormatch.dto.MentorResponseDTO;
import com.codecrafters.mentormatch.dto.incoming.MentorProfileRequest;
import com.codecrafters.mentormatch.model.MentorProfile;
import com.codecrafters.mentormatch.model.Review;
import com.codecrafters.mentormatch.model.User;
import com.codecrafters.mentormatch.repository.MentorProfileRepository;
import com.codecrafters.mentormatch.repository.ReviewRepository;
import com.codecrafters.mentormatch.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mentors")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class MentorController {

    private final MentorProfileRepository mentorProfileRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @GetMapping
    @Transactional
    public ResponseEntity<List<MentorResponseDTO>> getAllMentors(
            @RequestParam(required = false) List<String> skills) {

        List<MentorProfile> profiles = mentorProfileRepository.findAll();

        if (skills != null && !skills.isEmpty()) {
            // Sort mentors by how many skills overlap with the requested list
            profiles.sort((p1, p2) -> {
                long matchCount1 = p1.getSkills().stream()
                        .filter(mentorSkill -> skills.stream().anyMatch(s -> mentorSkill.toLowerCase().contains(s.toLowerCase())))
                        .count();

                long matchCount2 = p2.getSkills().stream()
                        .filter(mentorSkill -> skills.stream().anyMatch(s -> mentorSkill.toLowerCase().contains(s.toLowerCase())))
                        .count();

                // Sort descending (highest match first)
                return Long.compare(matchCount2, matchCount1);
            });

            // Optional: Filter out mentors who have 0 matches
            profiles = profiles.stream()
                    .filter(p -> p.getSkills().stream()
                            .anyMatch(mentorSkill -> skills.stream().anyMatch(s -> mentorSkill.toLowerCase().contains(s.toLowerCase()))))
                    .collect(Collectors.toList());
        }

        List<MentorResponseDTO> response = profiles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<MentorResponseDTO> getMentorById(@PathVariable Long id) {
        return mentorProfileRepository.findById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/profile")
    @Transactional
    public ResponseEntity<Void> saveMentorProfile(@Valid @RequestBody MentorProfileRequest request,
                                                  Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        MentorProfile profile = mentorProfileRepository.findById(user.getId())
                .orElseGet(MentorProfile::new);
        profile.setUser(user);
        profile.setSkills(request.expertise());
        profile.setAvailabilitySlots(request.availability());
        profile.setSessionTypes(request.sessionTypes());
        profile.setCapacity(request.capacity());

        mentorProfileRepository.save(profile);
        return ResponseEntity.ok().build();
    }

    // Helper method to map Entity -> DTO
    private MentorResponseDTO convertToDTO(MentorProfile profile) {
        MentorResponseDTO dto = new MentorResponseDTO();
        dto.setId(profile.getId());
        dto.setName(profile.getUser().getName());
        dto.setTitle(profile.getUser().getTitle());
        dto.setCompany(profile.getUser().getCompany());
        dto.setRating(profile.getUser().getRating());
        dto.setReviewCount(profile.getUser().getReviewCount());
        dto.setProfileBio(profile.getProfileBio());
        dto.setSkills(profile.getSkills());

        dto.setExperiences(profile.getExperiences().stream()
                .map(e -> new MentorResponseDTO.ExperienceDTO(e.getTitle(), e.getCompany(), e.getPeriod(), e.getDescription()))
                .toList());

        dto.setEducation(profile.getEducation().stream()
                .map(e -> new MentorResponseDTO.EducationDTO(e.getDegree(), e.getSchool(), e.getYear()))
                .toList());

        dto.setAvailability(profile.getAvailability().stream()
                .map(a -> new MentorResponseDTO.AvailabilityDTO(a.getDay(), a.getSlotTime().toString()))
                .toList());

        List<Review> reviews = reviewRepository.findByMentorId(profile.getId());
        dto.setReviews(reviews.stream()
                .map(r -> new MentorResponseDTO.ReviewDTO(
                        r.getMentee().getName(),
                        r.getMentee().getTitle(),
                        r.getRating(),
                        r.getComment(),
                        r.getCreatedAt().toLocalDate().toString()
                ))
                .toList());

        return dto;
    }
}