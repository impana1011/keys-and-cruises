package com.drive_ease.backend.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
@Entity @Table(name="vehicles")
public class Vehicle {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String name;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private VehicleCategory category;
 @Column(name="price_per_day",nullable=false,precision=10,scale=2) private BigDecimal pricePerDay;
 @Column(nullable=false) private Integer seats;
 @Column(nullable=false) private String fuel;
 @Column(nullable=false) private String transmission;
 @Column(nullable=false) private boolean available=true;
 @Column(name="image_url") private String imageUrl;
 public Vehicle() {}
 public Vehicle(String name,VehicleCategory category,BigDecimal pricePerDay,Integer seats,String fuel,String transmission,boolean available,String imageUrl){this.name=name;this.category=category;this.pricePerDay=pricePerDay;this.seats=seats;this.fuel=fuel;this.transmission=transmission;this.available=available;this.imageUrl=imageUrl;}
 public Long getId(){return id;} public void setId(Long v){id=v;}
 public String getName(){return name;} public void setName(String v){name=v;}
 public VehicleCategory getCategory(){return category;} public void setCategory(VehicleCategory v){category=v;}
 public BigDecimal getPricePerDay(){return pricePerDay;} public void setPricePerDay(BigDecimal v){pricePerDay=v;}
 public Integer getSeats(){return seats;} public void setSeats(Integer v){seats=v;}
 public String getFuel(){return fuel;} public void setFuel(String v){fuel=v;}
 public String getTransmission(){return transmission;} public void setTransmission(String v){transmission=v;}
 public boolean isAvailable(){return available;} public void setAvailable(boolean v){available=v;}
 public String getImageUrl(){return imageUrl;} public void setImageUrl(String v){imageUrl=v;}
}
