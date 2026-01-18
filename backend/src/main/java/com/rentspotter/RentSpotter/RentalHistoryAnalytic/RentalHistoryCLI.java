package com.rentspotter.RentSpotter.RentalHistoryAnalytic;



import com.rentspotter.RentSpotter.RentalHistoryAnalytic.controller.RentalHistoryController;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.model.Rating;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Scanner;
import java.util.Map;

@Component
public class RentalHistoryCLI implements CommandLineRunner {

    @Autowired
    private RentalHistoryController rentalController;

    private final Scanner scanner = new Scanner(System.in);

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=================================");
        System.out.println("   RENT SPOTTER - HISTORY CLI    ");
        System.out.println("=================================");

        boolean running = true;
        while (running) {
            printMenu();
            System.out.print("> Enter choice: ");
            String choice = scanner.nextLine();

            switch (choice) {
                case "1" -> viewTenantDashboard();
                case "2" -> viewLandlordDashboard();
                case "3" -> rateLandlord();
                case "4" -> generateLetter();
                case "0" -> {
                    System.out.println("Exiting system...");
                    running = false;
                }
                default -> System.out.println("Invalid option.");
            }
            System.out.println("\n---------------------------------\n");
        }
    }

    private void printMenu() {
        System.out.println("1. [Tenant] View History & Trust Score");
        System.out.println("2. [Landlord] View Portfolio & Reputation");
        System.out.println("3. [Tenant] Rate a Landlord");
        System.out.println("4. [Tenant] Generate Reference Letter");
        System.out.println("0. Exit");
    }

    // --- USE CASE HANDLERS ---
    private void viewTenantDashboard() {
        System.out.print("Enter Tenant ID: ");
        String tenantId = scanner.nextLine();

        // Call the Controller directly
        Map<String, Object> result = rentalController.getTenantDashboard(tenantId);

        System.out.println("\n--- Tenant Dashboard ---");
        System.out.println("Your Trust Score: " + result.get("myTrustScore"));
        System.out.println("Rental History: " + result.get("history"));
    }

    private void viewLandlordDashboard() {
        System.out.print("Enter Landlord ID: ");
        String landlordId = scanner.nextLine();

        Map<String, Object> result = rentalController.getLandlordDashboard(landlordId);

        System.out.println("\n--- Landlord Portfolio ---");
        System.out.println("Reputation Score: " + result.get("myReputationScore"));
        System.out.println("Properties: " + result.get("portfolio"));
    }

    private void rateLandlord() {
        System.out.println("\n--- Rate Your Landlord ---");
        Rating rating = new Rating();

        System.out.print("Your ID (Tenant): ");
        rating.setRaterId(scanner.nextLine());

        System.out.print("Landlord ID: ");
        rating.setRatedUserId(scanner.nextLine());

        System.out.print("Score (1-5): ");
        rating.setScore(Integer.parseInt(scanner.nextLine()));

        System.out.print("Comment: ");
        rating.setComment(scanner.nextLine());

        // Call Controller
        // rentalController.submitRating(rating);
        System.out.println("Submitted rating ");
    }

    private void generateLetter() {
        System.out.print("Enter Rental Record ID: ");
        String idStr = scanner.nextLine();

        // Call Controller
        // Note: Controller returns String, so we just print it
        String letter = rentalController.downloadLetter(idStr);

        System.out.println("\n[GENERATED DOCUMENT]");
        System.out.println(letter);
    }
}