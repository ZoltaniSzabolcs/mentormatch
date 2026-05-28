package com.codecrafters.mentormatch.repository;

import com.codecrafters.mentormatch.model.MentorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MentorProfileRepository extends JpaRepository<MentorProfile, Long> {
}