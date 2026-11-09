package com.drive_ease.backend.controller;
import com.drive_ease.backend.dto.BookingRequest;
import com.drive_ease.backend.dto.BookingResponse;
import com.drive_ease.backend.entity.Booking;
import com.drive_ease.backend.entity.BookingStatus;
import com.drive_ease.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api")
public class BookingController {
 private final BookingService service;
 public BookingController(BookingService service){this.service=service;}
 @GetMapping("/bookings") public List<BookingResponse> getAllBookings(@RequestParam(required=false) Long customerId){
  List<Booking> results=customerId==null?service.getAllBookings():service.getBookingsForCustomer(customerId);
  return results.stream().map(BookingResponse::from).toList();
 }
 @GetMapping("/bookings/{id}") public BookingResponse getBookingById(@PathVariable Long id){return BookingResponse.from(service.getBookingById(id));}
 @PostMapping("/bookings") public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(BookingResponse.from(service.createBooking(r)));}
 @PutMapping("/bookings/{id}/status") public BookingResponse updateBookingStatus(@PathVariable Long id,@RequestParam BookingStatus status){return BookingResponse.from(service.updateBookingStatus(id,status));}
}
