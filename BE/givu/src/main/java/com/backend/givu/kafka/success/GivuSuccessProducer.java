package com.backend.givu.kafka.success;

import com.backend.givu.model.requestDTO.GivuTransferEventDTO;
import com.backend.givu.model.responseDTO.FundingSuccessEventDTO;
import com.backend.givu.model.responseDTO.GivuSuccessDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
@RequiredArgsConstructor
@Slf4j
public class GivuSuccessProducer {

    private final KafkaTemplate<String, GivuSuccessDTO> kafkaTemplate;
    private static final String RESULT_SUCCESE_TOPIC = "success-funding-success";
    private static final String RESULT_FAIL_TOPIC = "success-funding-fail";

    public void sendSuccessEventAfterCommit (Long userId, int fundingId, int amount, int paymentId){
        String reason = "None";
        GivuSuccessDTO event =  new GivuSuccessDTO(userId, fundingId, amount, paymentId, reason);

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        kafkaTemplate.send(RESULT_SUCCESE_TOPIC, userId.toString(), event);
                        log.info("✅ paymentId: {}", event.getPaymentId());
                        log.info("✅ 펀딩 성공 이벤트 발송 완료: {}", event.getPaymentId());
                    }
                }
        );
    }

    public void sendFailEventImmediately (Long userId, int fundingId, int amount, int paymentId, String reason){

        log.info("📤 펀딩 실패 이벤트 발행  - paymentId: {}, fundingId: {}, amount: {}", paymentId, fundingId, amount);
        GivuSuccessDTO event =  new GivuSuccessDTO(userId, fundingId, amount, paymentId, reason);
        kafkaTemplate.send(RESULT_FAIL_TOPIC, String.valueOf(userId), event);
        log.info("📤 펀딩 실패 이벤트 발송 완료: {} ", paymentId);



    }



}
