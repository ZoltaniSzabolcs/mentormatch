package com.codecrafters.mentormatch.dto;

import lombok.Data;

import java.util.List;

@Data
public class MentorResponseDTO {
    private Long id;
    private String name;
    private String title;
    private String company;
    private Double rating;
    private Integer reviewCount;
    private String profileBio;
    private List<String> skills;

    // new fields
    private List<ExperienceDTO> experiences;
    private List<EducationDTO> education;
    private List<AvailabilityDTO> availability;
    private List<ReviewDTO> reviews;

    // nested DTOs as static inner classes:
    public record ExperienceDTO(String title, String company, String period, String description) {
    }

    public record EducationDTO(String degree, String school, String year) {
    }

    public record AvailabilityDTO(String day, String slotTime) {
    }

    public record ReviewDTO(String reviewerName, String reviewerRole, Integer rating, String comment,
                            String createdAt) {
    }
}