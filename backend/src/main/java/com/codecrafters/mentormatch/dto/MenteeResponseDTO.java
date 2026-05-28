package com.codecrafters.mentormatch.dto;

import lombok.Data;

import java.util.List;

@Data
public class MenteeResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String title;
    private String company;
    private String experienceLevel;
    private String learningStyle;
    private String availability;
    private List<String> goals;
    private Double rating;
    private Integer reviewCount;
}
