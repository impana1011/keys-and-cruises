package com.drive_ease.backend.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity @Table(name="bookings")
public class Booking {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="vehicle_id",nullable=false) private Vehicle vehicle;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="customer_id",nullable=false) private User customer;
 @Column(name="pickup_date",nullable=false) private LocalDate pickupDate;
 @Column(name="return_date",nullable=false) private LocalDate returnDate;
 @Column(name="total_price",nullable=false,precision=10,scale=2) private BigDecimal totalPrice;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private BookingStatus status=BookingStatus.CONFIRMED;
 @Column(name="pickup_location") private String pickupLocation;
 @Column(name="drop_location") private String dropLocation;
 @Column(name="created_at",nullable=false) private LocalDateTime createdAt=LocalDateTime.now();
 public Booking() {}
 public Booking(Vehicle vehicle,User customer,LocalDate pickupDate,LocalDate returnDate,BigDecimal totalPrice,BookingStatus status,String pickupLocation,String dropLocation){this.vehicle=vehicle;this.customer=customer;this.pickupDate=pickupDate;this.returnDate=returnDate;this.totalPrice=totalPrice;this.status=status;this.pickupLocation=pickupLocation;this.dropLocation=dropLocation;}
 public Long getId(){return id;} public void setId(Long v){id=v;}
 public Vehicle getVehicle(){return vehicle;} public void setVehicle(Vehicle v){vehicle=v;}
 public User getCustomer(){return customer;} public void setCustomer(User v){customer=v;}
 public LocalDate getPickupDate(){return pickupDate;} public void setPickupDate(LocalDate v){pickupDate=v;}
 public LocalDate getReturnDate(){return returnDate;} public void setReturnDate(LocalDate v){returnDate=v;}
 public BigDecimal getTotalPrice(){return totalPrice;} public void setTotalPrice(BigDecimal v){totalPrice=v;}
 public BookingStatus getStatus(){return status;} public void setStatus(BookingStatus v){status=v;}
 public String getPickupLocation(){return pickupLocation;} public void setPickupLocation(String v){pickupLocation=v;}
 public String getDropLocation(){return dropLocation;} public void setDropLocation(String v){dropLocation=v;}
 public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){createdAt=v;}
}
