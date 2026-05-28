package com.codecrafters.mentormatch.service;

import com.codecrafters.mentormatch.model.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import com.codecrafters.mentormatch.repository.UserRepository;
import com.codecrafters.mentormatch.model.UserInfoUserDetails;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserInfoUserDetailsService implements UserDetailsService {

    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Optional<User> userInfo = userRepository.findByEmail(email);
        return userInfo.map(UserInfoUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User " + email + " not found "));
    }
}
