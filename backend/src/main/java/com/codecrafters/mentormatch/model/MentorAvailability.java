package com.codecrafters.mentormatch.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalTime;

@Entity
@Data
@Table(name = "mentor_availability")
public class MentorAvailability {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id")
    private MentorProfile mentor;

    private String day;

    @Column(name = "slot_time")
    private LocalTime slotTime;
    // getters/setters
}
