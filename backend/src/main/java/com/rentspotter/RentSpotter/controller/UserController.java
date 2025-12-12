package com.rentspotter.RentSpotter.controller;

import com.rentspotter.RentSpotter.config.JwtUtil;
import com.rentspotter.RentSpotter.model.User;
import com.rentspotter.RentSpotter.service.UserService;
import com.rentspotter.RentSpotter.dto.RegisterRequest;
import com.rentspotter.RentSpotter.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        User user = userService.register(req);

        Map<String, Object> res = new HashMap<>();
        res.put("status", "success");
        res.put("message", "User registered successfully");
        res.put("user", user);

        return ResponseEntity.status(201).body(res);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String password = req.get("password");

        return ResponseEntity.ok(userService.login(email, password));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {

        User user = userService.getUserById(id);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of(
                    "status", "error",
                    "message", "User not found"
            ));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("username", user.getUsername());

        return ResponseEntity.ok(response);
    }

    // GET /api/users/landlord/{username}
    @GetMapping("/landlord/{username}")
    public ResponseEntity<?> getLandlordId(@PathVariable String username) {

        User user = userService.getUserByUsername(username);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "User not found"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "landlordId", user.getId()
        ));
    }

    // GET /api/users/tenant/{username}
    @GetMapping("/tenant/{username}")
    public ResponseEntity<?> getTenantId(@PathVariable String username) {

        User user = userService.getUserByUsername(username);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "User not found"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "tenantId", user.getId()
        ));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getMe(@RequestHeader("Authorization") String authHeader) {
        try {
            // 1. Clean the token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of(
                        "status", "error",
                        "message", "Missing or invalid Authorization header"
                ));
            }
            String token = authHeader.replace("Bearer ", "");

            var claims = jwtUtil.validateToken(token).getBody();
            String userId = claims.getSubject();

            User user = userService.getUserById(userId);

            if (user == null) {
                return ResponseEntity.status(404).body(Map.of(
                        "status", "error",
                        "message", "User not found"
                ));
            }

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "data", user
            ));

        } catch (Exception e) {
            // Handles expired tokens or signature errors
            return ResponseEntity.status(401).body(Map.of(
                    "status", "error",
                    "message", "Invalid or expired token"
            ));
        }
    }
}
