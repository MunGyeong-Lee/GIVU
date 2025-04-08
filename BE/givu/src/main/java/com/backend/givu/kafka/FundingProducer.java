package com.backend.givu.kafka;

import com.backend.givu.model.entity.Payment;
import com.backend.givu.model.requestDTO.GivuTransferEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
@RequiredArgsConstructor
@Slf4j
public class FundingProducer {



    private final KafkaTemplate<String, GivuTransferEventDTO> kafkaTemplate;

    // 펀딩 금액 증가 성공 시 (전제조건 : 트랜잭션이 성공적으로 종료되어야 함)
    public void sendSuccessEventAfterCommit(Payment payment) {
        String reason = null;
        GivuTransferEventDTO event = new GivuTransferEventDTO(payment, reason);

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        kafkaTemplate.send("fundedAmount", payment.getUser().getId().toString(), event);
                        log.info("✅ 펀딩 성공 이벤트 발송 완료: {}", event.getPaymentId());
                    }
                }
        );
    }

    // 펀딩 금액 증가 실패 시
    public void sendFailEventImmediately(Long userId, int paymentId, int fundingId, int amount, String reason) {

        log.info("📤 보상 이벤트 발행 완료 - paymentId: {}, fundingId: {}, amount: {}", paymentId, fundingId, amount);

        GivuTransferEventDTO event = new GivuTransferEventDTO();
        event.setUserId(userId);
        event.setPaymentId(paymentId);
        event.setFundingId(fundingId);
        event.setAmount(amount);
        event.setStatus("FAIL");
        event.setReason(reason);

        log.info("📤 펀딩 실패 이벤트 발송 완료: {}", paymentId);
        kafkaTemplate.send("refund-request", String.valueOf(paymentId), event);
    }





}
