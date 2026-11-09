package com.drive_ease.backend.dto;
import com.drive_ease.backend.entity.VehicleCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
public record VehicleRequest(@NotBlank(message="Vehicle name is required") String name,@NotNull(message="Category is required") VehicleCategory category,@NotNull(message="Daily price is required") @Positive(message="Daily price must be positive") BigDecimal pricePerDay,@NotNull(message="Seats are required") Integer seats,@NotBlank(message="Fuel type is required") String fuel,@NotBlank(message="Transmission type is required") String transmission,boolean available,String imageUrl) {}
