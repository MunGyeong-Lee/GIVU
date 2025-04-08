package com.backend.givu.kafka;

import com.backend.givu.model.entity.Payment;
import com.backend.givu.model.requestDTO.GivuTransferEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class GivuProducer {



    private final KafkaTemplate<String, GivuTransferEventDTO> kafkaTemplate;

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



}



