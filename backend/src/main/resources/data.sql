INSERT IGNORE INTO users (id, name, email, password, role) VALUES
  (1, 'Priya Sharma', 'priya@example.com', 'password123', 'CUSTOMER'),
  (2, 'Aarav Mehta', 'aarav@example.com', 'password123', 'CUSTOMER'),
  (3, 'Admin User', 'admin@driveease.com', 'admin123', 'ADMIN');
INSERT IGNORE INTO vehicles (id, name, category, price_per_day, seats, fuel, transmission, available, image_url) VALUES
  (1, 'Maruti Suzuki Swift', 'CAR', 1200.00, 5, 'Petrol', 'Manual', TRUE, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'),
  (2, 'Maruti Suzuki WagonR', 'CAR', 1000.00, 5, 'CNG / Petrol', 'Manual', TRUE, 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80'),
  (3, 'Hyundai Creta', 'SUV', 2500.00, 5, 'Diesel', 'Automatic', TRUE, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'),
  (4, 'Honda Activa 6G', 'BIKE', 400.00, 2, 'Petrol', 'Automatic', TRUE, 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80'),
  (5, 'Royal Enfield Classic 350', 'BIKE', 1000.00, 2, 'Petrol', 'Manual', TRUE, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'),
  (6, 'Force Tempo Traveller 12-Seater (AC)', 'TEMPO_TRAVELLER', 3500.00, 12, 'Diesel', 'Manual', TRUE, 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=800&q=80');
INSERT IGNORE INTO bookings (id, vehicle_id, customer_id, pickup_date, return_date, total_price, status, pickup_location, drop_location) VALUES
  (1, 1, 1, '2026-11-10', '2026-11-12', 2400.00, 'CONFIRMED', 'Bengaluru Airport', 'Mysuru'),
  (2, 4, 2, '2026-11-15', '2026-11-17', 800.00, 'PENDING', 'Koramangala', 'MG Road');
