package com.codecrafters.mentormatch.repository;

import com.codecrafters.mentormatch.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByMentorIdAndStatus(Long mentorId, String status);
}
