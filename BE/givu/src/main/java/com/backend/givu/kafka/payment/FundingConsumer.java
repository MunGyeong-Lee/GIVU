package com.backend.givu.kafka.payment;

import com.backend.givu.model.requestDTO.GivuTransferEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FundingConsumer {

    private final FundingTransferService fundingTransferService;



    @Transactional
    @KafkaListener(
            id = "transferListener",
            topics= "givu-transfer",           // 구독중인 토픽명
            groupId = "userbalance-group",     // 해당하는 group
            concurrency = "3",              // 동시에 실행될 Consumer 쓰레드 수 (동시성 처리용)
            containerFactory = "kafkaListenerContainerFactory"  // 커스텀 Kafka 설정을 적용한 리스너 팩토리 bean 이름
    )
    public void userbalance(GivuTransferEventDTO event){
        log.info("📥 KafkaListener 동작 시작!");
        log.info("📥 Kafka 메시지 수신: {}", event);
        log.info("펀딩 아이디 :{}", event.getPaymentId() );

        fundingTransferService.addFundedAmount(event.getUserId(), event.getFundingId(), event.getPaymentId(), event.getAmount());


    }


}
