package com.rentspotter.RentSpotter.service;

import com.rentspotter.RentSpotter.config.JwtUtil;
import com.rentspotter.RentSpotter.model.User;
import com.rentspotter.RentSpotter.repository.UserRepository;
import com.rentspotter.RentSpotter.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // REGISTER
    public User register(RegisterRequest req) {

        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists!");
        }

        User user = new User();
        user.setEmail(req.getEmail());
        user.setUsername(req.getUsername());
        user.setPhonenumber(req.getPhonenumber());
        user.setRole(req.getRole());
        user.setPassword(passwordEncoder.encode(req.getPassword()));

        return userRepository.save(user);
    }

    // LOGIN
    public Map<String, Object> login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId());

        Map<String, Object> res = new HashMap<>();
        res.put("status", "success");
        res.put("message", "Logged in successfully");
        res.put("token", token);
        res.put("user", user);

        return res;
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElse(null);
    }

    // get landlord ID (same as getTenant, same logic)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElse(null);
    }
}
