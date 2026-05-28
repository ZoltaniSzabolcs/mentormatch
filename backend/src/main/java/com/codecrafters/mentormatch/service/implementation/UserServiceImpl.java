package com.codecrafters.mentormatch.service.implementation;

import com.codecrafters.mentormatch.model.User;
import com.codecrafters.mentormatch.repository.UserRepository;
import com.codecrafters.mentormatch.service.UserService;
import lombok.RequiredArgsConstructor;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.core.RepositoryCreationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${pagination.page-size}")
    private int defaultPageSize;

    @Override
    public User create(User user) {
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            return userRepository.saveAndFlush(user);
        } catch (RepositoryCreationException e) {
            throw new ServiceException("User registration failed", e);
        }
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Page<User> getAll(
            Optional<Integer> page,
            Optional<String> sortBy,
            Optional<String> direction,
            Optional<Integer> pageSize) {
        Sort.Direction orderDirection = direction.map(String::toUpperCase)
                .map(Sort.Direction::valueOf)
                .orElse(Sort.Direction.ASC);
        return userRepository.findAll(
                PageRequest.of(
                        page.orElse(0),
                        pageSize.orElse(defaultPageSize),
                        orderDirection,
                        sortBy.orElse("id")
                )
        );
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
}
