package com.codecrafters.mentormatch.service;

import com.codecrafters.mentormatch.model.User;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface UserService {
    User create(User user);

    Optional<User> findById(Long id);

    Page<User> getAll(
            Optional<Integer> page,
            Optional<String> sortBy,
            Optional<String> direction,
            Optional<Integer> pageSize);

    void deleteById(Long id);

}