package com.codecrafters.mentormatch.repository;

import com.codecrafters.mentormatch.model.MenteeProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MenteeProfileRepository extends JpaRepository<MenteeProfile, Long> {
    Optional<MenteeProfile> findByUserEmail(String email);
}
