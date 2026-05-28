package com.codecrafters.mentormatch.repository;

import com.codecrafters.mentormatch.model.MentorEducation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MentorEducationRepository extends JpaRepository<MentorEducation, Long> {
}
