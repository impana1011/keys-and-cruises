package com.drive_ease.backend.dto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
public record BookingRequest(
        @NotNull(message="Vehicle id is required") Long vehicleId,
        @NotNull(message="Customer id is required") Long customerId,
        @NotNull(message="Pickup date is required") LocalDate pickupDate,
        @NotNull(message="Return date is required") LocalDate returnDate,
        @NotNull(message="Total price is required") @Positive(message="Total price must be positive") BigDecimal totalPrice,
        String pickupLocation,
        String dropLocation
) {}
