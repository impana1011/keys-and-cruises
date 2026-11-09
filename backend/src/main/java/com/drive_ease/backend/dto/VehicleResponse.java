package com.drive_ease.backend.dto;

import com.drive_ease.backend.entity.Vehicle;

import java.math.BigDecimal;

public record VehicleResponse(
        Long id,
        String name,
        String category,
        BigDecimal pricePerDay,
        Integer seats,
        String fuel,
        String transmission,
        boolean available,
        String imageUrl
) {
    public static VehicleResponse from(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getName(),
                vehicle.getCategory().name(),
                vehicle.getPricePerDay(),
                vehicle.getSeats(),
                vehicle.getFuel(),
                vehicle.getTransmission(),
                vehicle.isAvailable(),
                vehicle.getImageUrl()
        );
    }
}
