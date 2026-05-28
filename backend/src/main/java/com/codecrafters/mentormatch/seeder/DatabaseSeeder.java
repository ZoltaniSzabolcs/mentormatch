package com.codecrafters.mentormatch.seeder;

import com.codecrafters.mentormatch.model.*;
import com.codecrafters.mentormatch.model.enums.Availability;
import com.codecrafters.mentormatch.model.enums.ExperienceLevel;
import com.codecrafters.mentormatch.model.enums.LearningStyle;
import com.codecrafters.mentormatch.model.enums.Role;
import com.codecrafters.mentormatch.repository.*;
import com.codecrafters.mentormatch.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@AllArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserService userService;
    private final MentorProfileRepository mentorProfileRepository;
    private final MenteeProfileRepository menteeProfileRepository;
    private final MentorExperienceRepository experienceRepository;
    private final MentorEducationRepository educationRepository;
    private final MentorAvailabilityRepository availabilityRepository;
    private final ReviewRepository reviewRepository;
    private final SessionRepository sessionRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("🌱 Seeding database with realistic prototype data...");
            seedAll();
            log.info("✅ Database seeding complete!");
        } else {
            log.info("⚡ Database already contains data. Skipping seeder.");
        }
    }

    private void seedAll() {

        // ── MENTORS ──────────────────────────────────────────────────────────

        // Mentor 1: Ana Luca
        User m1 = createUser("Ana Luca", "ana.luca@encenter.ro",
                Role.MENTOR, "Robotics Engineering Specialist", "EnCenter Ltd.", 4.9, 18, 42);
        MentorProfile p1 = new MentorProfile();
        p1.setUser(m1);
        p1.setHourlyRate(0.0);
        p1.setProfileBio("MSc in Robotics Engineering. Certified Robotics Programmer."
                         + "Passionate about teaching AI and Mechatronics to the next generation of engineers.");
        p1.setExperienceSummary("7 years in industrial robotics and machine learning "
                                + "integrations.");
        p1.setSkills(Arrays.asList("Advanced Robotics", "AI & Machine Learning",
                "Robot Vision Systems", "Robot Control Systems", "Mechatronics"));
        mentorProfileRepository.save(p1);

        MentorExperience e1a = new MentorExperience();
        e1a.setMentor(p1);
        e1a.setTitle("Robotics Engineering Specialist");
        e1a.setCompany("EnCenter Ltd.");
        e1a.setPeriod("2021 - Present");
        e1a.setDescription("Leading robotics integration projects, mentoring junior engineers on ROS and computer vision pipelines.");
        experienceRepository.save(e1a);

        MentorExperience e1b = new MentorExperience();
        e1b.setMentor(p1);
        e1b.setTitle("Robotics Engineer");
        e1b.setCompany("Bosch Cluj");
        e1b.setPeriod("2018 - 2021");
        e1b.setDescription("Developed machine vision systems for automated quality control on manufacturing lines.");
        experienceRepository.save(e1b);

        MentorExperience e1c = new MentorExperience();
        e1c.setMentor(p1);
        e1c.setTitle("Junior Automation Engineer");
        e1c.setCompany("Continental AG");
        e1c.setPeriod("2016 - 2018");
        e1c.setDescription("Maintained and programmed ABB industrial robot arms for automotive assembly.");
        experienceRepository.save(e1c);

        MentorEducation ed1a = new MentorEducation();
        ed1a.setMentor(p1);
        ed1a.setDegree("MSc in Robotics Engineering");
        ed1a.setSchool("Technical University of Cluj-Napoca");
        ed1a.setYear("2016");
        educationRepository.save(ed1a);

        MentorEducation ed1b = new MentorEducation();
        ed1b.setMentor(p1);
        ed1b.setDegree("BSc in Mechatronics Engineering");
        ed1b.setSchool("Technical University of Cluj-Napoca");
        ed1b.setYear("2014");
        educationRepository.save(ed1b);

        MentorAvailability av1a = new MentorAvailability();
        av1a.setMentor(p1);
        av1a.setDay("Monday");
        av1a.setSlotTime(LocalTime.of(10, 0));
        availabilityRepository.save(av1a);

        MentorAvailability av1b = new MentorAvailability();
        av1b.setMentor(p1);
        av1b.setDay("Monday");
        av1b.setSlotTime(LocalTime.of(14, 0));
        availabilityRepository.save(av1b);

        MentorAvailability av1c = new MentorAvailability();
        av1c.setMentor(p1);
        av1c.setDay("Wednesday");
        av1c.setSlotTime(LocalTime.of(11, 0));
        availabilityRepository.save(av1c);

        // ─────────────────────────────────────────────────────────────────────

        // Mentor 2: Sarah Anderson
        User m2 = createUser("Sarah Anderson", "sarah.anderson@encenter.ro", Role.MENTOR, "Senior Project Manager", "EnCenter Ltd.", 4.8, 22, 55);
        MentorProfile p2 = new MentorProfile();
        p2.setUser(m2);
        p2.setHourlyRate(0.0);
        p2.setProfileBio("Agile evangelist and PMP certified project manager. I help teams cut through "
                         + "chaos and ship software that matters. Ask me anything about Scrum, stakeholder management, or career growth in PM.");
        p2.setExperienceSummary("10+ years managing cross-functional software teams.");
        p2.setSkills(Arrays.asList("Project Management", "Agile/Scrum", "Risk Management", "Leadership", "Stakeholder Communication"));
        mentorProfileRepository.save(p2);

        MentorExperience e2a = new MentorExperience();
        e2a.setMentor(p2);
        e2a.setTitle("Senior Project Manager");
        e2a.setCompany("EnCenter Ltd.");
        e2a.setPeriod("2020 - Present");
        e2a.setDescription("Managing a portfolio of 6 concurrent software projects with teams across Romania and Germany.");
        experienceRepository.save(e2a);

        MentorExperience e2b = new MentorExperience();
        e2b.setMentor(p2);
        e2b.setTitle("Project Manager");
        e2b.setCompany("Cognizant Softvision");
        e2b.setPeriod("2016 - 2020");
        e2b.setDescription("Delivered 15+ enterprise software projects using Agile methodologies for US-based clients.");
        experienceRepository.save(e2b);

        MentorExperience e2c = new MentorExperience();
        e2c.setMentor(p2);
        e2c.setTitle("Business Analyst");
        e2c.setCompany("Accenture");
        e2c.setPeriod("2013 - 2016");
        e2c.setDescription("Gathered requirements and coordinated delivery for ERP implementations across 3 industries.");
        experienceRepository.save(e2c);

        MentorEducation ed2a = new MentorEducation();
        ed2a.setMentor(p2);
        ed2a.setDegree("PMP Certification");
        ed2a.setSchool("Project Management Institute");
        ed2a.setYear("2017");
        educationRepository.save(ed2a);

        MentorEducation ed2b = new MentorEducation();
        ed2b.setMentor(p2);
        ed2b.setDegree("BA in Business Administration");
        ed2b.setSchool("Babeș-Bolyai University");
        ed2b.setYear("2013");
        educationRepository.save(ed2b);

        MentorAvailability av2a = new MentorAvailability();
        av2a.setMentor(p2);
        av2a.setDay("Tuesday");
        av2a.setSlotTime(LocalTime.of(9, 0));
        availabilityRepository.save(av2a);

        MentorAvailability av2b = new MentorAvailability();
        av2b.setMentor(p2);
        av2b.setDay("Thursday");
        av2b.setSlotTime(LocalTime.of(14, 0));
        availabilityRepository.save(av2b);

        MentorAvailability av2c = new MentorAvailability();
        av2c.setMentor(p2);
        av2c.setDay("Thursday");
        av2c.setSlotTime(LocalTime.of(16, 0));
        availabilityRepository.save(av2c);

        // ─────────────────────────────────────────────────────────────────────

        // Mentor 3: Emma Blake
        User m3 = createUser("Emma Blake", "emma.blake@encenter.ro", Role.MENTOR, "HR Specialist", "EnCenter Ltd.", 4.7, 14, 31);
        MentorProfile p3 = new MentorProfile();
        p3.setUser(m3);
        p3.setHourlyRate(0.0);
        p3.setProfileBio("Dedicated to organizational psychology, employee growth, and building strong corporate cultures. I love helping people find their voice in the workplace.");
        p3.setExperienceSummary("5 years in talent acquisition and internal learning & development.");
        p3.setSkills(Arrays.asList("Effective Communication", "Conflict Resolution", "Public Speaking", "Interview Preparation", "Personal Branding"));
        mentorProfileRepository.save(p3);

        MentorExperience e3a = new MentorExperience();
        e3a.setMentor(p3);
        e3a.setTitle("HR Specialist");
        e3a.setCompany("EnCenter Ltd.");
        e3a.setPeriod("2022 - Present");
        e3a.setDescription("Running talent acquisition, onboarding programs, and internal mentoring initiatives.");
        experienceRepository.save(e3a);

        MentorExperience e3b = new MentorExperience();
        e3b.setMentor(p3);
        e3b.setTitle("Talent Acquisition Coordinator");
        e3b.setCompany("Endava");
        e3b.setPeriod("2019 - 2022");
        e3b.setDescription("Hired 200+ engineers annually, built employer branding campaigns that reduced time-to-hire by 30%.");
        experienceRepository.save(e3b);

        MentorEducation ed3a = new MentorEducation();
        ed3a.setMentor(p3);
        ed3a.setDegree("MSc in Organizational Psychology");
        ed3a.setSchool("Babeș-Bolyai University");
        ed3a.setYear("2019");
        educationRepository.save(ed3a);

        MentorEducation ed3b = new MentorEducation();
        ed3b.setMentor(p3);
        ed3b.setDegree("BA in Psychology");
        ed3b.setSchool("Babeș-Bolyai University");
        ed3b.setYear("2017");
        educationRepository.save(ed3b);

        MentorAvailability av3a = new MentorAvailability();
        av3a.setMentor(p3);
        av3a.setDay("Wednesday");
        av3a.setSlotTime(LocalTime.of(10, 0));
        availabilityRepository.save(av3a);

        MentorAvailability av3b = new MentorAvailability();
        av3b.setMentor(p3);
        av3b.setDay("Friday");
        av3b.setSlotTime(LocalTime.of(13, 0));
        availabilityRepository.save(av3b);

        // ─────────────────────────────────────────────────────────────────────

        // Mentor 4: David Kim
        User m4 = createUser("David Kim", "david.kim@encenter.ro", Role.MENTOR, "Lead Software Architect", "EnCenter Ltd.", 4.9, 27, 68);
        MentorProfile p4 = new MentorProfile();
        p4.setUser(m4);
        p4.setHourlyRate(0.0);
        p4.setProfileBio("Full-stack developer with a deep love for Spring Boot, PostgreSQL, and clean architecture. 12 years building enterprise systems means I've made every mistake so you don't have to.");
        p4.setExperienceSummary("12 years designing scalable enterprise web applications.");
        p4.setSkills(Arrays.asList("Java/Spring Boot", "Software Architecture", "PostgreSQL", "System Design", "Microservices", "REST APIs"));
        mentorProfileRepository.save(p4);

        MentorExperience e4a = new MentorExperience();
        e4a.setMentor(p4);
        e4a.setTitle("Lead Software Architect");
        e4a.setCompany("EnCenter Ltd.");
        e4a.setPeriod("2019 - Present");
        e4a.setDescription("Defining technical strategy and architecture standards across 4 product engineering teams.");
        experienceRepository.save(e4a);

        MentorExperience e4b = new MentorExperience();
        e4b.setMentor(p4);
        e4b.setTitle("Senior Backend Engineer");
        e4b.setCompany("UiPath");
        e4b.setPeriod("2015 - 2019");
        e4b.setDescription("Built core automation engine components processing millions of daily workflow executions.");
        experienceRepository.save(e4b);

        MentorExperience e4c = new MentorExperience();
        e4c.setMentor(p4);
        e4c.setTitle("Software Engineer");
        e4c.setCompany("Fortech");
        e4c.setPeriod("2011 - 2015");
        e4c.setDescription("Delivered full-stack Java EE applications for banking and insurance clients.");
        experienceRepository.save(e4c);

        MentorEducation ed4a = new MentorEducation();
        ed4a.setMentor(p4);
        ed4a.setDegree("MSc in Computer Science");
        ed4a.setSchool("Technical University of Cluj-Napoca");
        ed4a.setYear("2011");
        educationRepository.save(ed4a);

        MentorEducation ed4b = new MentorEducation();
        ed4b.setMentor(p4);
        ed4b.setDegree("BSc in Computer Science");
        ed4b.setSchool("Technical University of Cluj-Napoca");
        ed4b.setYear("2009");
        educationRepository.save(ed4b);

        MentorEducation ed4c = new MentorEducation();
        ed4c.setMentor(p4);
        ed4c.setDegree("AWS Solutions Architect Certification");
        ed4c.setSchool("Amazon Web Services");
        ed4c.setYear("2020");
        educationRepository.save(ed4c);

        MentorAvailability av4a = new MentorAvailability();
        av4a.setMentor(p4);
        av4a.setDay("Monday");
        av4a.setSlotTime(LocalTime.of(17, 0));
        availabilityRepository.save(av4a);

        MentorAvailability av4b = new MentorAvailability();
        av4b.setMentor(p4);
        av4b.setDay("Wednesday");
        av4b.setSlotTime(LocalTime.of(17, 0));
        availabilityRepository.save(av4b);

        MentorAvailability av4c = new MentorAvailability();
        av4c.setMentor(p4);
        av4c.setDay("Friday");
        av4c.setSlotTime(LocalTime.of(15, 0));
        availabilityRepository.save(av4c);

        // ─────────────────────────────────────────────────────────────────────

        // Mentor 5: Elena Popescu
        User m5 = createUser("Elena Popescu", "elena.popescu@encenter.ro", Role.MENTOR, "Principal Data Scientist", "EnCenter Ltd.", 4.8, 19, 47);
        MentorProfile p5 = new MentorProfile();
        p5.setUser(m5);
        p5.setHourlyRate(0.0);
        p5.setProfileBio("Turning raw data into actionable business intelligence. Love discussing algorithms and statistical models over coffee. I mentor on Python, ML pipelines, and breaking into data science.");
        p5.setExperienceSummary("8 years in predictive modeling and big data analytics.");
        p5.setSkills(Arrays.asList("Data Analysis", "Python", "Machine Learning", "Data Visualization", "Statistics", "SQL"));
        mentorProfileRepository.save(p5);

        MentorExperience e5a = new MentorExperience();
        e5a.setMentor(p5);
        e5a.setTitle("Principal Data Scientist");
        e5a.setCompany("EnCenter Ltd.");
        e5a.setPeriod("2020 - Present");
        e5a.setDescription("Building ML models for HR analytics and employee retention prediction.");
        experienceRepository.save(e5a);

        MentorExperience e5b = new MentorExperience();
        e5b.setMentor(p5);
        e5b.setTitle("Data Scientist");
        e5b.setCompany("Orange Romania");
        e5b.setPeriod("2016 - 2020");
        e5b.setDescription("Developed churn prediction and customer segmentation models serving 10M+ subscribers.");
        experienceRepository.save(e5b);

        MentorExperience e5c = new MentorExperience();
        e5c.setMentor(p5);
        e5c.setTitle("Data Analyst");
        e5c.setCompany("Raiffeisen Bank");
        e5c.setPeriod("2014 - 2016");
        e5c.setDescription("Created automated reporting dashboards and credit risk scoring models.");
        experienceRepository.save(e5c);

        MentorEducation ed5a = new MentorEducation();
        ed5a.setMentor(p5);
        ed5a.setDegree("MSc in Data Science & AI");
        ed5a.setSchool("Babeș-Bolyai University");
        ed5a.setYear("2014");
        educationRepository.save(ed5a);

        MentorEducation ed5b = new MentorEducation();
        ed5b.setMentor(p5);
        ed5b.setDegree("BSc in Mathematics & Informatics");
        ed5b.setSchool("Babeș-Bolyai University");
        ed5b.setYear("2012");
        educationRepository.save(ed5b);

        MentorAvailability av5a = new MentorAvailability();
        av5a.setMentor(p5);
        av5a.setDay("Tuesday");
        av5a.setSlotTime(LocalTime.of(11, 0));
        availabilityRepository.save(av5a);

        MentorAvailability av5b = new MentorAvailability();
        av5b.setMentor(p5);
        av5b.setDay("Thursday");
        av5b.setSlotTime(LocalTime.of(10, 0));
        availabilityRepository.save(av5b);

        MentorAvailability av5c = new MentorAvailability();
        av5c.setMentor(p5);
        av5c.setDay("Thursday");
        av5c.setSlotTime(LocalTime.of(15, 0));
        availabilityRepository.save(av5c);

        // ── MENTEES ──────────────────────────────────────────────────────────

        User u1 = createUser("Alex Ionescu", "alex.ionescu@encenter.ro", Role.MENTEE, "Junior Engineer", "EnCenter Ltd.", 0, 0, 0);
        MenteeProfile mp1 = new MenteeProfile();
        mp1.setUser(u1);
        mp1.setExperienceLevel(ExperienceLevel.BEGINNER);
        mp1.setLearningStyle(LearningStyle.EXPLORATORY);
        mp1.setAvailability(Availability.WEEKDAYS_MORNING);
        mp1.setGoals(Arrays.asList("Understand AI tools", "Improve presentation skills", "Learn project management basics"));
        menteeProfileRepository.save(mp1);

        User u2 = createUser("Mihai Stan", "mihai.stan@encenter.ro", Role.MENTEE, "QA Tester", "EnCenter Ltd.", 0, 0, 0);
        MenteeProfile mp2 = new MenteeProfile();
        mp2.setUser(u2);
        mp2.setExperienceLevel(ExperienceLevel.INTERMEDIATE);
        mp2.setLearningStyle(LearningStyle.STRUCTURED);
        mp2.setAvailability(Availability.WEEKDAYS_AFTERNOON);
        mp2.setGoals(Arrays.asList("Learn automated testing", "Java/Spring Boot basics"));
        menteeProfileRepository.save(mp2);

        User u3 = createUser("Maria Radu", "maria.radu@encenter.ro", Role.MENTEE, "Marketing Associate", "EnCenter Ltd.", 0, 0, 0);
        MenteeProfile mp3 = new MenteeProfile();
        mp3.setUser(u3);
        mp3.setExperienceLevel(ExperienceLevel.BEGINNER);
        mp3.setLearningStyle(LearningStyle.PROJECT_BASED);
        mp3.setAvailability(Availability.WEEKDAYS_EVENING);
        mp3.setGoals(Arrays.asList("Data Analysis", "Understanding SEO metrics"));
        menteeProfileRepository.save(mp3);

        User u4 = createUser("John Doe", "john.doe@encenter.ro", Role.MENTEE, "Intern", "EnCenter Ltd.", 0, 0, 0);
        MenteeProfile mp4 = new MenteeProfile();
        mp4.setUser(u4);
        mp4.setExperienceLevel(ExperienceLevel.BEGINNER);
        mp4.setLearningStyle(LearningStyle.STRUCTURED);
        mp4.setAvailability(Availability.WEEKENDS);
        mp4.setGoals(Arrays.asList("Public Speaking", "Corporate Communication"));
        menteeProfileRepository.save(mp4);

        User u5 = createUser("Laura Vasile", "laura.vasile@encenter.ro", Role.MENTEE, "Mid-level Developer", "EnCenter Ltd.", 0, 0, 0);
        MenteeProfile mp5 = new MenteeProfile();
        mp5.setUser(u5);
        mp5.setExperienceLevel(ExperienceLevel.INTERMEDIATE);
        mp5.setLearningStyle(LearningStyle.PROJECT_BASED);
        mp5.setAvailability(Availability.WEEKDAYS_AFTERNOON);
        mp5.setGoals(Arrays.asList("Software Architecture", "Leadership transition"));
        menteeProfileRepository.save(mp5);

        // ── SESSIONS & REVIEWS ───────────────────────────────────────────────

        // Past completed sessions with reviews
        saveSessionAndReview(p1, u1, "Introduction to Robot Vision", LocalDate.of(2026, 3, 10), LocalTime.of(10, 0), 60, 5, "Ana was incredibly clear and patient. I finally understand how vision systems work!");
        saveSessionAndReview(p1, u2, "ROS Fundamentals", LocalDate.of(2026, 3, 24), LocalTime.of(14, 0), 60, 5, "Best technical mentor I've had. She maps complex topics to real examples perfectly.");
        saveSessionAndReview(p1, u4, "AI Tools Overview", LocalDate.of(2026, 4, 1), LocalTime.of(10, 0), 45, 4, "Very informative session. Would love to go deeper next time.");

        saveSessionAndReview(p2, u1, "Agile Kickoff Planning", LocalDate.of(2026, 3, 15), LocalTime.of(9, 0), 45, 5, "Sarah gave me a complete framework for running sprint planning. Immediately applied it.");
        saveSessionAndReview(p2, u3, "Stakeholder Communication", LocalDate.of(2026, 3, 28), LocalTime.of(14, 0), 60, 5, "Practical, direct, and genuinely helpful. Highly recommend.");
        saveSessionAndReview(p2, u5, "Risk Management Basics", LocalDate.of(2026, 4, 4), LocalTime.of(16, 0), 60, 4, "Great session. Sarah has a real-world story for every concept.");

        saveSessionAndReview(p3, u4, "Interview Prep", LocalDate.of(2026, 3, 18), LocalTime.of(10, 0), 45, 5, "Emma helped me completely reframe how I present myself. Got the job offer the next week!");
        saveSessionAndReview(p3, u1, "Public Speaking Confidence", LocalDate.of(2026, 4, 2), LocalTime.of(13, 0), 45, 5, "Structured, warm, and encouraging. Emma is amazing.");

        saveSessionAndReview(p4, u2, "Spring Boot Architecture Deep Dive", LocalDate.of(2026, 3, 20), LocalTime.of(17, 0), 90, 5, "David's knowledge of architecture patterns is unmatched. Worth 10 tutorials.");
        saveSessionAndReview(p4, u5, "System Design Interview Prep", LocalDate.of(2026, 4, 3), LocalTime.of(17, 0), 60, 5, "Incredibly thorough. David walks through every trade-off clearly.");
        saveSessionAndReview(p4, u1, "REST API Best Practices", LocalDate.of(2026, 4, 7), LocalTime.of(15, 0), 60, 4, "Solid session with lots of practical code examples.");

        saveSessionAndReview(p5, u3, "Intro to Data Analysis with Python", LocalDate.of(2026, 3, 22), LocalTime.of(11, 0), 60, 5, "Elena made pandas and matplotlib click for me after months of struggling.");
        saveSessionAndReview(p5, u1, "ML Model Evaluation", LocalDate.of(2026, 4, 5), LocalTime.of(10, 0), 60, 5, "Exceptional mentor. She connected every concept to a business use case.");
        saveSessionAndReview(p5, u4, "Breaking into Data Science", LocalDate.of(2026, 4, 8), LocalTime.of(15, 0), 45, 5, "Elena gave me a concrete roadmap. Finally feel like I have a plan.");

        // Upcoming confirmed sessions
        saveUpcomingSession(p1, u1, "Advanced Vision Pipeline", LocalDate.of(2026, 5, 27), LocalTime.of(10, 0), 60);
        saveUpcomingSession(p2, u1, "Sprint Retrospective Techniques", LocalDate.of(2026, 5, 29), LocalTime.of(9, 0), 45);
        saveUpcomingSession(p4, u2, "Microservices Patterns", LocalDate.of(2026, 5, 30), LocalTime.of(17, 0), 90);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private void saveSessionAndReview(MentorProfile mentorProfile, User mentee,
                                      String topic, LocalDate date, LocalTime time,
                                      int duration, int rating, String comment) {
        Session session = new Session();
        session.setMentor(mentorProfile.getUser());
        session.setMentee(mentee);
        session.setTopic(topic);
        session.setSessionDate(date);
        session.setSessionTime(time);
        session.setDuration(duration);
        session.setType("video");
        session.setStatus("COMPLETED");
        sessionRepository.save(session);

        Review review = new Review();
        review.setSession(session);
        review.setMentor(mentorProfile.getUser());
        review.setMentee(mentee);
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.of(date, time).plusHours(1));
        reviewRepository.save(review);
    }

    private void saveUpcomingSession(MentorProfile mentorProfile, User mentee,
                                     String topic, LocalDate date, LocalTime time, int duration) {
        Session session = new Session();
        session.setMentor(mentorProfile.getUser());
        session.setMentee(mentee);
        session.setTopic(topic);
        session.setSessionDate(date);
        session.setSessionTime(time);
        session.setDuration(duration);
        session.setType("video");
        session.setStatus("CONFIRMED");
        sessionRepository.save(session);
    }

    private User createUser(String name, String email, Role role, String title,
                            String company, double rating, int reviewCount, int sessionsCompleted) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword("passwordA1+");
        user.setRole(role);
        user.setTitle(title);
        user.setCompany(company);
        user.setLocation("Cluj-Napoca");
        if (role == Role.MENTOR) {
            user.setRating(rating);
            user.setReviewCount(reviewCount);
            user.setSessionsCompleted(sessionsCompleted);
            user.setResponseTime("Usually responds in 2 hours");
        }
        return userService.create(user);
    }
}