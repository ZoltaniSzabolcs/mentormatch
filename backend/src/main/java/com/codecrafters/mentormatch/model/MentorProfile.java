package com.codecrafters.mentormatch.model;

import com.codecrafters.mentormatch.model.enums.Availability;
import com.codecrafters.mentormatch.model.enums.MentorSessionType;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "mentor_profiles")
public class MentorProfile {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private Double hourlyRate;
    private String availabilityNote;
    
    @Column(columnDefinition = "TEXT")
    private String profileBio;
    
    @Column(columnDefinition = "TEXT")
    private String experienceSummary;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "mentor_skills", joinColumns = @JoinColumn(name = "mentor_id"))
    @Column(name = "skill_name")
    private List<String> skills;

    @OneToMany(mappedBy = "mentor", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<MentorExperience> experiences = new ArrayList<>();

    @OneToMany(mappedBy = "mentor", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<MentorEducation> education = new ArrayList<>();

    @OneToMany(mappedBy = "mentor", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<MentorAvailability> availability = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "mentor_availability_slots", joinColumns = @JoinColumn(name = "mentor_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "availability_slot")
    private List<Availability> availabilitySlots;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "mentor_session_types", joinColumns = @JoinColumn(name = "mentor_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "session_type")
    private List<MentorSessionType> sessionTypes;

    @Column
    private Integer capacity;
}