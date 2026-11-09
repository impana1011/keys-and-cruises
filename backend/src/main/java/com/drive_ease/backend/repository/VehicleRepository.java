package com.drive_ease.backend.repository;
import com.drive_ease.backend.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
public interface VehicleRepository extends JpaRepository<Vehicle,Long>{}
