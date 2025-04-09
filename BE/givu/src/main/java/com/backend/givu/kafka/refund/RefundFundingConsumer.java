package com.backend.givu.kafka.refund;

import com.backend.givu.model.requestDTO.RefundResultEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class RefundFundingConsumer {

    private final RefundFundingService refundFundingService;

    /**
     * 환불 성공 이벤트 수신
     */
    @KafkaListener(
            id= "refund-success-listener",
            topics = "refund-funding-success",
            groupId = "refund-consumer-group",
            containerFactory = "refundResultKafkaListenerContainerFactory")
    public void consumeSuccess(ConsumerRecord<String, RefundResultEventDTO> record) {
        RefundResultEventDTO event = record.value();
        log.info("✅ Kafka 환불 성공 이벤트 수신: userId={}, fundingId={}, amount={}", event.getUserId(), event.getFundingId(), event.getAmount());

        try {
            refundFundingService.handleRefundSuccess(event);
        } catch (Exception e) {
            log.error("❌ 환불 성공 처리 실패 (로직): fundingId={}, 이유={}", record.key(), e.getMessage());
            // TODO: 에러 기록 or 재시도 로직
        }
    }

    /**
     * 환불 실패 이벤트 수신
     */
    @KafkaListener(
            id= "refund-fail-listener",
            topics = "refund-funding-fail",
            groupId = "refund-consumer-group",
            concurrency = "3",
            containerFactory = "refundResultKafkaListenerContainerFactory")
    public void consumeFailure(ConsumerRecord<String, RefundResultEventDTO> record) {
        RefundResultEventDTO event = record.value();
        log.warn("⚠️ [Kafka] 환불 실패 이벤트 수신: userId={}, fundingId={}, amount={}, reason={}", event.getUserId(), event.getFundingId(), event.getAmount(), event.getMessage());

        try {
            refundFundingService.rollbackBalance(event);
        } catch (Exception e) {
            log.error("❌ 환불 실패 처리 실패 (로직): paymentId={}, 이유={}", record.key(), e.getMessage());
        }
    }



}