package com.drive_ease.backend.config;

import com.drive_ease.backend.entity.User;
import com.drive_ease.backend.entity.UserRole;
import com.drive_ease.backend.entity.Vehicle;
import com.drive_ease.backend.entity.VehicleCategory;
import com.drive_ease.backend.repository.UserRepository;
import com.drive_ease.backend.repository.VehicleRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
public class DemoUserInitializer {

    @Bean
    ApplicationRunner initializeDemoUsers(UserRepository users, VehicleRepository vehicles,
                                          PasswordEncoder passwordEncoder) {
        return args -> {
            ensureUser(users, passwordEncoder, "Priya Sharma", "priya@example.com", "password123", UserRole.CUSTOMER);
            ensureUser(users, passwordEncoder, "Aarav Mehta", "aarav@example.com", "password123", UserRole.CUSTOMER);
            ensureUser(users, passwordEncoder, "Admin User", "admin@driveease.com", "admin123", UserRole.ADMIN);
            if (vehicles.count() == 0) {
                seedVehicles(vehicles);
            }
        };
    }

    private void ensureUser(UserRepository users, PasswordEncoder passwordEncoder, String name,
                            String email, String rawPassword, UserRole role) {
        User user = users.findByEmail(email).orElseGet(() -> new User(name, email, rawPassword, role));
        if (!user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(rawPassword));
        }
        users.save(user);
    }

    private void seedVehicles(VehicleRepository vehicles) {
        vehicles.save(new Vehicle("Maruti Suzuki Swift", VehicleCategory.CAR, new BigDecimal("1200.00"),
                5, "Petrol", "Manual", true,
                "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80"));
        vehicles.save(new Vehicle("Maruti Suzuki WagonR", VehicleCategory.CAR, new BigDecimal("1000.00"),
                5, "CNG / Petrol", "Manual", true,
                "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80"));
        vehicles.save(new Vehicle("Hyundai Creta", VehicleCategory.SUV, new BigDecimal("2500.00"),
                5, "Diesel", "Automatic", true,
                "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"));
        vehicles.save(new Vehicle("Honda Activa 6G", VehicleCategory.BIKE, new BigDecimal("400.00"),
                2, "Petrol", "Automatic", true,
                "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"));
        vehicles.save(new Vehicle("Royal Enfield Classic 350", VehicleCategory.BIKE, new BigDecimal("1000.00"),
                2, "Petrol", "Manual", true,
                "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"));
        vehicles.save(new Vehicle("Force Tempo Traveller 12-Seater (AC)", VehicleCategory.TEMPO_TRAVELLER,
                new BigDecimal("3500.00"), 12, "Diesel", "Manual", true,
                "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=800&q=80"));
    }
}
