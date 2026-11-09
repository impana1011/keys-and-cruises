package com.drive_ease.backend.service;
import com.drive_ease.backend.dto.VehicleRequest;
import com.drive_ease.backend.entity.Vehicle;
import com.drive_ease.backend.repository.VehicleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@Service
public class VehicleService {
 private final VehicleRepository repository;
 public VehicleService(VehicleRepository repository){this.repository=repository;}
 public List<Vehicle> getAllVehicles(){return repository.findAll();}
 public Vehicle getVehicleById(Long id){return repository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Vehicle not found with id "+id));}
 private Vehicle apply(Vehicle v,VehicleRequest r){v.setName(r.name());v.setCategory(r.category());v.setPricePerDay(r.pricePerDay());v.setSeats(r.seats());v.setFuel(r.fuel());v.setTransmission(r.transmission());v.setAvailable(r.available());v.setImageUrl(r.imageUrl());return v;}
 public Vehicle createVehicle(VehicleRequest request){return repository.save(apply(new Vehicle(),request));}
 public Vehicle updateVehicle(Long id,VehicleRequest request){return repository.save(apply(getVehicleById(id),request));}
 public void deleteVehicle(Long id){repository.delete(getVehicleById(id));}
}
