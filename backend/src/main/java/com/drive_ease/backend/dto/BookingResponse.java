package com.drive_ease.backend.dto;

import com.drive_ease.backend.entity.Booking;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BookingResponse(
        Long id,
        Long vehicleId,
        String vehicleName,
        String vehicleCategory,
        String customer,
        LocalDate pickupDate,
        LocalDate returnDate,
        BigDecimal totalPrice,
        String status,
        String pickupLocation,
        String dropLocation
) {
    public static BookingResponse from(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getVehicle().getId(),
                booking.getVehicle().getName(),
                booking.getVehicle().getCategory().name(),
                booking.getCustomer().getName(),
                booking.getPickupDate(),
                booking.getReturnDate(),
                booking.getTotalPrice(),
                booking.getStatus().name(),
                booking.getPickupLocation(),
                booking.getDropLocation()
        );
    }
}
