package com.drive_ease.backend.repository;
import com.drive_ease.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("select b from Booking b where b.customer.id = :customerId")
    List<Booking> findAllByCustomerId(@Param("customerId") Long customerId);
}
