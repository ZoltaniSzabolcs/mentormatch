package com.codecrafters.mentormatch.repository;

import com.codecrafters.mentormatch.model.MentorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MentorAvailabilityRepository extends JpaRepository<MentorAvailability, Long> {
}
