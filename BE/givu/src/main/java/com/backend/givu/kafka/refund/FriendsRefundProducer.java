package com.backend.givu.kafka.refund;

import com.backend.givu.model.requestDTO.RefundResultEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
@Slf4j
@RequiredArgsConstructor
public class FriendsRefundProducer {

    private final KafkaTemplate<String, RefundResultEventDTO> kafkaTemplate;

    private static final String RESULT_SUCCESS_TOPIC = "refund-funding-success";
    private static final String RESULT_FAIL_TOPIC = "refund-funding-fail";

    // 환불 성공 시, 트랜잭션 커밋 후 전송
    public void sendSuccessAfterCommit(Long userId, int fundingId, int amount, int paymentId) {
        RefundResultEventDTO event = new RefundResultEventDTO(userId, fundingId, amount, paymentId, true, "환불 성공");

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        kafkaTemplate.send(RESULT_SUCCESS_TOPIC, String.valueOf(fundingId), event);
                        log.info("✅ [Kafka] 환불 성공 이벤트 전송 (after commit): userId={}, fundingId={}, amount={}",
                                userId, fundingId, amount);
                    }
                }
        );
    }

    // 환불 실패 시
    public void sendFailure(Long userId, int fundingId, int amount, int paymentId, String reason) {
        RefundResultEventDTO event = new RefundResultEventDTO(userId, fundingId, amount, paymentId, false, reason);
        kafkaTemplate.send(RESULT_FAIL_TOPIC, String.valueOf(fundingId), event);
        log.warn("❌ [Kafka] 환불 실패 이벤트 전송: userId={}, fundingId={}, amount={}, reason={}", userId, fundingId, amount, reason);
    }
}
