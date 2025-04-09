package com.backend.givu.kafka.product;

import com.backend.givu.model.entity.Payment;
import com.backend.givu.model.responseDTO.PaymentFailedEventDTO;
import com.backend.givu.model.responseDTO.PaymentSuccessEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    // 결제 성공 이벤트 (트랜잭션 커밋 후 발송)
    public void sendSuccessEventAfterCommit(Payment payment) {
        PaymentSuccessEventDTO event = new PaymentSuccessEventDTO(payment);

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        kafkaTemplate.send("payment-success-topic", payment.getId().toString(), event);
                        log.info("✅ 결제 성공 이벤트 발송 완료: {}", payment.getId());
                    }
                }
        );
    }

    // 결제 실패 이벤트 (즉시 발송)
    public void sendFailEventImmediately(Integer paymentId, Long userId, String reason) {
        PaymentFailedEventDTO event = new PaymentFailedEventDTO();
        event.setPaymentId(paymentId);
        event.setUserId(userId);
        event.setReason(reason);
        event.setStatus("FAIL");

        kafkaTemplate.send("payment-fail-topic", paymentId.toString(), event);
        log.warn("📤 결제 실패 이벤트 발송 완료: {}", paymentId);
    }
}
