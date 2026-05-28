CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('MENTOR', 'MENTEE', 'ADMIN')),
    image TEXT,
    bio TEXT,
    location VARCHAR(100),
    company VARCHAR(100),
    title VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    sessions_completed INT DEFAULT 0,
    response_time VARCHAR(50)
);

CREATE TABLE Mentor_Profiles (
    user_id INT PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    hourly_rate DECIMAL(10,2),
    availability_note TEXT,
    profile_bio TEXT,
    experience_summary TEXT
);

CREATE TABLE Mentee_Profiles (
    user_id INT PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    experience_level VARCHAR(50),
    learning_style VARCHAR(50),
    availability VARCHAR(100)
);

CREATE TABLE Mentor_Skills (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES Mentor_Profiles(user_id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL
);

CREATE TABLE Mentor_Availability (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES Mentor_Profiles(user_id) ON DELETE CASCADE,
    day VARCHAR(20), -- 'Monday'
    slot_time TIME   -- '14:00'
);

CREATE TABLE Mentee_Goals (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Mentee_Profiles(user_id) ON DELETE CASCADE,
    goal TEXT NOT NULL
);

CREATE TABLE Sessions (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES Users(id),
    mentee_id INT REFERENCES Users(id),
    topic VARCHAR(255),
    session_date DATE,
    session_time TIME,
    duration INT, -- in minutes
    type VARCHAR(20), -- 'video' or 'chat'
    status VARCHAR(20) DEFAULT 'PENDING', -- 'confirmed', 'pending', 'cancelled'
    is_first_session BOOLEAN DEFAULT false,
    notes TEXT
);

CREATE TABLE Mentor_Requests (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES Users(id),
    mentee_id INT REFERENCES Users(id),
    goal TEXT,
    match_score INT,
    message TEXT,
    status VARCHAR(20) DEFAULT 'PENDING'
);

CREATE TABLE Reviews (
    id SERIAL PRIMARY KEY,
    session_id INT REFERENCES Sessions(id),
    mentor_id INT REFERENCES Users(id),
    mentee_id INT REFERENCES Users(id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- for matching algorithm
CREATE INDEX idx_mentor_skills ON Mentor_Skills(skill_name);
CREATE INDEX idx_user_role ON Users(role);

CREATE TABLE Mentor_Experience (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES Mentor_Profiles(user_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    period VARCHAR(50),          -- e.g. '2020 - Present'
    description TEXT
);

CREATE TABLE Mentor_Education (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES Mentor_Profiles(user_id) ON DELETE CASCADE,
    degree VARCHAR(150) NOT NULL,
    school VARCHAR(150) NOT NULL,
    year VARCHAR(10)
);