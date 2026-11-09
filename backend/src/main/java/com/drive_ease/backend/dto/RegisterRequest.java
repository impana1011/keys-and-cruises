package com.drive_ease.backend.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
public record RegisterRequest(@NotBlank(message="Name is required") String name,@NotBlank(message="Email is required") @Email(message="Please provide a valid email") String email,@NotBlank(message="Password is required") String password) {}
