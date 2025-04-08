package com.backend.givu.model.repository;

import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.entity.Payment;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {


    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Payment p WHERE p.id = :paymentId")
    Optional<Payment> findByIdForUpdate(@Param("paymentId") Integer paymentId);

    boolean existsByUserIdAndRelatedProductId(Long userId, Integer productId);

    @Query("SELECT p FROM Payment p JOIN FETCH p.relatedProduct WHERE p.user.id = :userId")
    List<Payment> findByUserIdWithProduct(@Param("userId") Long userId);

}
