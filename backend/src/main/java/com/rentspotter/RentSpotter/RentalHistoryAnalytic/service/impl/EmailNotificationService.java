package com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.impl;

import com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.NotificationService;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService implements NotificationService {
    @Override
    public void notifyUser(String userId, String message) {
        // Simulating sending an email
        System.out.println(">>> [EMAIL SYSTEM] Sending to User " + userId + ": " + message);
    }
}
