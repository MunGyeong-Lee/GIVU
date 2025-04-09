package com.backend.givu.kafka.success;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Payment;
import com.backend.givu.model.responseDTO.FundingSuccessEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SuccessFundingProducer {

    private final KafkaTemplate<String, FundingSuccessEventDTO> kafkaTemplate;

    public void sendSuccessEvent(Funding funding, Payment payment) {

            FundingSuccessEventDTO event = new FundingSuccessEventDTO(funding, payment);
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    kafkaTemplate.send("success-funding", payment.getUser().getId().toString(), event);
                    log.info("✅ success-funding 이벤트 발송: {}", event);
                }
            });

    }
}