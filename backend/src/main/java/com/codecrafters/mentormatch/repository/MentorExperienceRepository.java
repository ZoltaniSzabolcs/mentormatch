package com.codecrafters.mentormatch.repository;

import com.codecrafters.mentormatch.model.MentorExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MentorExperienceRepository extends JpaRepository<MentorExperience, Long> {
}
