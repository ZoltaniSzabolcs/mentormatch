package com.codecrafters.mentormatch.controller;

import com.codecrafters.mentormatch.dto.SessionBookingRequest;
import com.codecrafters.mentormatch.model.Session;
import com.codecrafters.mentormatch.model.User;
import com.codecrafters.mentormatch.repository.SessionRepository;
import com.codecrafters.mentormatch.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class SessionController {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    @PostMapping("/book")
    public ResponseEntity<Session> bookSession(@RequestBody SessionBookingRequest request) {

        // 1. Fetch the Mentor and Mentee
        User mentor = userRepository.findById(request.getMentorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mentor not found"));

        User mentee = userRepository.findById(request.getMenteeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mentee not found"));

        // 2. Build the Session entity
        Session session = new Session();
        session.setMentor(mentor);
        session.setMentee(mentee);
        session.setSessionDate(request.getSessionDate());
        session.setTopic(request.getTopic());
        session.setType(request.getSessionType());
        session.setNotes(request.getNotes());

        // Convert "9:00 AM" String to LocalTime
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH);
        LocalTime parsedTime = LocalTime.parse(request.getSessionTime(), timeFormatter);
        session.setSessionTime(parsedTime);

        // Hardcode prototype defaults
        session.setStatus("PENDING");
        session.setDuration(60);
        session.setIsFirstSession(true);

        // 3. Save to database
        Session savedSession = sessionRepository.save(session);

        // 4. Return HTTP 201 Created
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSession);
    }

    @GetMapping("/mentor/{mentorId}/pending")
    public ResponseEntity<List<Session>> getPendingSessions(@PathVariable Long mentorId) {
        List<Session> pendingSessions = sessionRepository.findByMentorIdAndStatus(mentorId, "PENDING");
        return ResponseEntity.ok(pendingSessions);
    }

    // Endpoint to accept or decline a session
    @PatchMapping("/{sessionId}/status")
    public ResponseEntity<Session> updateSessionStatus(
            @PathVariable Long sessionId,
            @RequestParam String status) {

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));

        session.setStatus(status.toUpperCase()); // "ACCEPTED" or "DECLINED"
        Session updatedSession = sessionRepository.save(session);

        return ResponseEntity.ok(updatedSession);
    }
}