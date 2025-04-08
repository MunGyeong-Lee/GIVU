package com.backend.givu.kafka;

import com.backend.givu.model.requestDTO.GivuTransferEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GivuConsumer {


    private final GivuTransferService givuTransferService;


    /**
     * 펀딩 성공 이벤트 수신
     */

    @Transactional
    @KafkaListener(
            id = "givu-success-listener",
            topics = "fundedAmount",
            groupId = "givu-consumer-group-v2",
            concurrency = "3",              // 동시에 실행될 Consumer 쓰레드 수 (동시성 처리용)
            containerFactory = "kafkaListenerContainerFactory"
//            autoStartup = "false"
    )
    public void handleFundingSuccess(GivuTransferEventDTO event) {
        log.info("📥 펀딩 성공 이벤트 수신 - paymentId: {}, userId: {}", event.getPaymentId(), event.getUserId());

        try {
            givuTransferService.confirmPayment(event.getPaymentId());
        } catch (Exception e) {
            log.error("❌ 펀딩 성공 처리 중 오류 발생", e);
            throw e; // 롤백 및 retry 위해 예외 재던짐
        }
    }


    /**
     * 펀딩 실패 이벤트 수신
     */

    @Transactional
    @KafkaListener(
            id = "givu-fail-listener",
            topics = "refund-request",
            groupId = "givu-consumer-group",
            concurrency = "3",              // 동시에 실행될 Consumer 쓰레드 수 (동시성 처리용)
            containerFactory = "kafkaListenerContainerFactory"
//            autoStartup = "false"
    )
    public void handleFundingFail(GivuTransferEventDTO event) {
        log.info("📥 펀딩 실패 이벤트 수신 - paymentId: {}, reason: {}", event.getPaymentId(), event.getReason());

        try {
            givuTransferService.rollbackBalance(event.getUserId(), event.getAmount(), event.getPaymentId());
        } catch (Exception e) {
            log.error("❌ 보상 트랜잭션 실패", e);
            throw e; // Kafka가 재시도/에러 핸들러 처리
        }
    }




}
