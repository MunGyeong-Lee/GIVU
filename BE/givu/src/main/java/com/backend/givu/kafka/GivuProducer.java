package com.backend.givu.kafka;

import com.backend.givu.model.entity.Payment;
import com.backend.givu.model.requestDTO.GivuTransferEventDTO;
import com.backend.givu.model.requestDTO.OrderCreatedEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
@RequiredArgsConstructor
@Slf4j
public class GivuProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendKafkaEventAfterCommit(Payment payment, Long userId) {
        String reason = null;
        GivuTransferEventDTO event = new GivuTransferEventDTO(payment, reason);

        // 트랜잭션 커밋 후 실행되도록
        org.springframework.transaction.support.TransactionSynchronizationManager.registerSynchronization(
                new org.springframework.transaction.support.TransactionSynchronizationAdapter() {
                    @Override
                    public void afterCommit() {
                        kafkaTemplate.send("userbalance", userId.toString(), event);
                        log.info("✅ Kafka 이벤트 발행 완료 (after commit): {}", event.getPaymentId());
                    }
                }
        );
    }

    public void sendKafkaEventAfterCommit(OrderCreatedEventDTO event) {
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        kafkaTemplate.send("order-created-topic", event.getUserId().toString(), event);
                        log.info("✅ Kafka 결제 요청 이벤트 발행 완료 (after commit) - paymentId: {}", event.getPaymentId());
                    }
                }
        );
    }



}



