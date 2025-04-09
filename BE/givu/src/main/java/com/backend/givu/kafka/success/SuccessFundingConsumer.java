package com.backend.givu.kafka.success;

import com.backend.givu.model.requestDTO.RefundResultEventDTO;
import com.backend.givu.model.responseDTO.GivuSuccessDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SuccessFundingConsumer {

    private final SuccessFundingService successFundingService;

    @Transactional
    @KafkaListener(
            id= "fundingSuccess-success-listener",
            topics = "success-funding-success",
            groupId = "confirm-payment-group",
            concurrency = "3",
            containerFactory = "givuSuccessKafkaListenerContainerFactory")
    public void consumeSuccess(ConsumerRecord<String, GivuSuccessDTO> record) {
        GivuSuccessDTO event = record.value();
        log.info("✅ 최종 성공 이벤트 수신: {}", event);
        log.info("paymentId: {}", event.getPaymentId());

        try {
            successFundingService.confirmPayment(event);
        } catch (Exception e) {
            log.error("❌ 환불 성공 처리 실패 (로직): fundingId={}, 이유={}", record.key(), e.getMessage());
        }

    }

    @Transactional
    @KafkaListener(
            id= "fundingSuccess-fail-listener",
            topics = "success-funding-fail",
            groupId = "rollback-balance-group",
            containerFactory = "givuSuccessKafkaListenerContainerFactory")
    public void consumeFailure(ConsumerRecord<String, GivuSuccessDTO> record){
        GivuSuccessDTO event = record.value();
        log.info("❌ 실패 이벤트 수신: {}", event);
        log.info("paymentId: {}", event.getPaymentId());

        try {
            successFundingService.rollbackBalance(event);
        } catch (Exception e) {
            log.error("❌ 환불 실패 처리 실패 (로직): paymentId={}, 이유={}", record.key(), e.getMessage());
        }
    }
}
