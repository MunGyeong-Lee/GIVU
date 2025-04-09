package com.backend.givu.model.requestDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreatedEventDTO {
    private Long userId;
    private int productId;
    private int quantity;
    private int totalAmount;
    private int paymentId;
    private String status;
    private String paymentMethod;
    private LocalDateTime createdAt;
}
