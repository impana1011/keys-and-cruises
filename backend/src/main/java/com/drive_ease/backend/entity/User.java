package com.drive_ease.backend.entity;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
@Entity @Table(name="users")
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String name;
 @Column(nullable=false, unique=true) private String email;
 @Column(name="password",nullable=false) private String password;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private UserRole role=UserRole.CUSTOMER;
 @OneToMany(mappedBy="customer") private List<Booking> bookings=new ArrayList<>();
 public User() {}
 public User(String name,String email,String password,UserRole role){this.name=name;this.email=email;this.password=password;this.role=role;}
 public Long getId(){return id;} public void setId(Long v){id=v;}
 public String getName(){return name;} public void setName(String v){name=v;}
 public String getEmail(){return email;} public void setEmail(String v){email=v;}
 public String getPassword(){return password;} public void setPassword(String v){password=v;}
 public UserRole getRole(){return role;} public void setRole(UserRole v){role=v;}
 public List<Booking> getBookings(){return bookings;} public void setBookings(List<Booking> v){bookings=v;}
}
