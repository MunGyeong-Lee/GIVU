package com.backend.givu.kafka.payment;

import com.backend.givu.kafka.payment.FundingProducer;
import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Payment;
import com.backend.givu.model.repository.FundingRepository;
import com.backend.givu.model.repository.PaymentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FundingTransferService {

    private final FundingRepository fundingRepository;
    private final PaymentRepository paymentRepository;
    private final FundingProducer fundingProducer;

    /**
     * 펀딩금액 추가
     */
    @Transactional
    public void addFundedAmount(Long userId, int fundingId, int paymentId, int amount) {

        try {
            Funding funding = fundingRepository.findByIdForUpdate(fundingId)
                    .orElseThrow(() -> new EntityNotFoundException("해당하는 펀딩이 없습니다."));
            Payment payment = paymentRepository.findByIdForUpdate(paymentId)
                    .orElseThrow(() -> new EntityNotFoundException("결제 정보가 없습니다: " + paymentId));

            log.info("현재 펀딩 모금액(반영 전:{} ", funding.getFundedAmount());
            funding.addFundedAmount(amount); //펀딩 모금액 증가
            log.info("현재 펀딩 모금액(반영 후):{} ", funding.getFundedAmount());
            log.info("펀딩 금액 증가 다 처리 완료");

            fundingRepository.save(funding);

            //  성공 시 이벤트 전송
            fundingProducer.sendSuccessEventAfterCommit(payment); // 성공 시 이벤트 전송


//            if (true) {
//                throw new RuntimeException("강제 에러 발생 (보상 이벤트 테스트)");
//            }


        }catch (Exception e){
            log.error("❌ 펀딩 금액 반영 실패! 보상 이벤트 발행", e);
            fundingProducer.sendFailEventImmediately(userId, paymentId, fundingId, amount, "펀딩 반영 실패");
            throw e;
        }
    }




}
