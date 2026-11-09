package com.drive_ease.backend.service;
import com.drive_ease.backend.dto.BookingRequest;
import com.drive_ease.backend.entity.*;
import com.drive_ease.backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@Service
public class BookingService {
 private final BookingRepository bookings; private final VehicleRepository vehicles; private final UserRepository users;
 public BookingService(BookingRepository bookings,VehicleRepository vehicles,UserRepository users){this.bookings=bookings;this.vehicles=vehicles;this.users=users;}
 public List<Booking> getAllBookings(){return bookings.findAll();}
 public List<Booking> getBookingsForCustomer(Long customerId){return bookings.findAllByCustomerId(customerId);}
 public Booking getBookingById(Long id){return bookings.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Booking not found with id "+id));}
 public Booking createBooking(BookingRequest r){
  if(!r.returnDate().isAfter(r.pickupDate())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Return date must be after pickup date");
  Vehicle v=vehicles.findById(r.vehicleId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Vehicle not found with id "+r.vehicleId()));
  User u=users.findById(r.customerId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Customer not found with id "+r.customerId()));
  Booking booking=new Booking(v,u,r.pickupDate(),r.returnDate(),r.totalPrice(),BookingStatus.CONFIRMED,r.pickupLocation(),r.dropLocation());
  v.setAvailable(false); vehicles.save(v); return bookings.save(booking);
 }
 public Booking updateBookingStatus(Long id,BookingStatus status){Booking b=getBookingById(id);b.setStatus(status);return bookings.save(b);}
}
