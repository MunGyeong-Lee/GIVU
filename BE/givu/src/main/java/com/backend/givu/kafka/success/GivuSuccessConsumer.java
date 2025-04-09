package com.backend.givu.kafka.success;

import com.backend.givu.model.responseDTO.FundingSuccessEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GivuSuccessConsumer {

    private final GivuSuccessService givuSuccessService;

    @Transactional
    @KafkaListener(
            id = "successListener",
            topics = "success-funding",
            groupId = "success-funding-group",
            concurrency = "3",
            containerFactory = "successKafkaListenerContainerFactory")
    public void handleSuccessFunding(FundingSuccessEventDTO event) {
        try {
            givuSuccessService.addBalance(
                    event.getUserId(), event.getFundingId(), event.getAmount(), event.getPaymentId());
        } catch (Exception e) {
            log.error("❌ 잔액 추가 실패 - 보상 이벤트 발행", e);
        }

    }
}
