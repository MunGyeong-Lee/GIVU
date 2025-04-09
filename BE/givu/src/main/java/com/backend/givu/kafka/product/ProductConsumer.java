package com.backend.givu.kafka.product;

import com.backend.givu.model.requestDTO.OrderCreatedEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductConsumer {
    private final ProductTransferService productTransferService;

    @Transactional
    @KafkaListener(
            topics = "order-created-topic",
            groupId = "order-group",
            containerFactory = "orderEventListenerContainerFactory"
    )
    public void handleOrder(OrderCreatedEventDTO event) {
        log.info("📦 주문 이벤트 수신: {}", event);
        // 주문 처리 로직
        productTransferService.purchaseProduct(event);
    }

}
