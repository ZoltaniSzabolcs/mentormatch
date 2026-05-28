package com.codecrafters.mentormatch.model;

import com.codecrafters.mentormatch.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String image;
    private String bio;
    private String location;
    private String company;
    private String title;
    
    private Double rating = 0.0;
    private Integer reviewCount = 0;
    private Integer sessionsCompleted = 0;
    private String responseTime;
}