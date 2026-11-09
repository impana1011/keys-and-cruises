package com.drive_ease.backend.controller;
import com.drive_ease.backend.dto.VehicleRequest;
import com.drive_ease.backend.dto.VehicleResponse;
import com.drive_ease.backend.entity.Vehicle;
import com.drive_ease.backend.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api")
public class VehicleController {
 private final VehicleService service;
 public VehicleController(VehicleService service){this.service=service;}
 @GetMapping("/vehicles") public List<VehicleResponse> getAllVehicles(){return service.getAllVehicles().stream().map(VehicleResponse::from).toList();}
 @GetMapping("/vehicles/{id}") public VehicleResponse getVehicleById(@PathVariable Long id){return VehicleResponse.from(service.getVehicleById(id));}
 @PostMapping("/vehicles") public ResponseEntity<VehicleResponse> createVehicle(@Valid @RequestBody VehicleRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(VehicleResponse.from(service.createVehicle(r)));}
 @PutMapping("/vehicles/{id}") public VehicleResponse updateVehicle(@PathVariable Long id,@Valid @RequestBody VehicleRequest r){return VehicleResponse.from(service.updateVehicle(id,r));}
 @DeleteMapping("/vehicles/{id}") public ResponseEntity<Void> deleteVehicle(@PathVariable Long id){service.deleteVehicle(id);return ResponseEntity.noContent().build();}
}
