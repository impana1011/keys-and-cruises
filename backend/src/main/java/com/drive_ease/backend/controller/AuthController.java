package com.drive_ease.backend.controller;
import com.drive_ease.backend.dto.*;
import com.drive_ease.backend.entity.User;
import com.drive_ease.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api")
public class AuthController {
 private final UserService service;
 public AuthController(UserService service){this.service=service;}
 @PostMapping("/auth/login") public ResponseEntity<Map<String,Object>> login(@Valid @RequestBody LoginRequest request){return ResponseEntity.ok(Map.of("message","Login successful","user",userView(service.authenticate(request.email(),request.password()))));}
 @PostMapping("/auth/register") public ResponseEntity<Map<String,Object>> register(@Valid @RequestBody RegisterRequest request){return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message","Registration successful","user",userView(service.register(request))));}
 private Map<String,Object> userView(User user){return Map.of("id",user.getId(),"name",user.getName(),"email",user.getEmail(),"role",user.getRole().name());}
}
