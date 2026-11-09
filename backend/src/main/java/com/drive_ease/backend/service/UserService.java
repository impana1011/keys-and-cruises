package com.drive_ease.backend.service;
import com.drive_ease.backend.dto.RegisterRequest;
import com.drive_ease.backend.entity.User;
import com.drive_ease.backend.entity.UserRole;
import com.drive_ease.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;
@Service
public class UserService {
 private final UserRepository userRepository;
 private final PasswordEncoder passwordEncoder;
 public UserService(UserRepository repo,PasswordEncoder passwordEncoder){userRepository=repo;this.passwordEncoder=passwordEncoder;}
 public List<User> getAllUsers(){return userRepository.findAll();}
 public Optional<User> findByEmail(String email){return userRepository.findByEmail(email.toLowerCase());}
 public User register(RegisterRequest request){
  if(userRepository.findByEmail(request.email().trim().toLowerCase()).isPresent()) throw new ResponseStatusException(HttpStatus.CONFLICT,"User with this email already exists");
  return userRepository.save(new User(request.name().trim(),request.email().trim().toLowerCase(),passwordEncoder.encode(request.password()),UserRole.CUSTOMER));
 }
 public User authenticate(String email,String password){return userRepository.findByEmail(email.trim().toLowerCase()).filter(u->passwordEncoder.matches(password,u.getPassword())).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password"));}
}
