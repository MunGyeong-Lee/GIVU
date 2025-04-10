package com.backend.givu.kafka.success;

import com.backend.givu.model.Enum.FundingsStatus;
import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.Enum.PaymentsTransactionType;
import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Participant;
import com.backend.givu.model.entity.Payment;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.FundingRepository;
import com.backend.givu.model.repository.PaymentRepository;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.responseDTO.ApiResponse;
import com.backend.givu.model.responseDTO.FundingSuccessDTO;
import com.backend.givu.model.responseDTO.GivuSuccessDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SuccessFundingService {
    private final FundingRepository fundingRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final SuccessFundingProducer successFundingProducer;


    /**
     * 펀딩 상태 COMPLETE 처리 및  거래 내역 생성
     */
    @Transactional
    public ApiResponse<FundingSuccessDTO> fundingSuccess(Long userId, int fundingId) {

        // 1. 펀딩 존재 확인 및 락킹
        Funding funding = fundingRepository.findByIdForUpdate(fundingId)
                .orElseThrow(() -> new EntityNotFoundException("펀딩이 존재하지 않습니다"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("유저가 존재하지 않습니다"));

        funding.setStatus(FundingsStatus.CANCELED); // 펀딩 상태 CANCELED 처리

        // 2. 거래내역 생성 및 pending 상태로 저장
        Payment payment = Payment.builder() //serId, fundingId, amount, PaymentsStatus.PENDING);
                .user(user)
                .relatedFunding(funding)
                .relatedProduct(null)
                .amount(funding.getFundedAmount())
                .status(PaymentsStatus.PENDING)
                .transactionType(PaymentsTransactionType.REFUND)
                .build();
        paymentRepository.save(payment);

        log.info("paymentId={}", payment.getId());

        // 트랜젝션 및 커밋 완료 이후 이벤트 발송
        successFundingProducer.sendSuccessEvent(funding, payment);

        return ApiResponse.success(new FundingSuccessDTO(funding));
    }


    /**
     * 펀딩 기뷰페이 이체 성공
     */
    @Transactional
    public void confirmPayment(GivuSuccessDTO event){
        log.info("펀딩 기뷰페이 이체 성공 - 이체 내역 상태 변경 시도 ");
        try {


            // 1. 이체 내역 존재 확인 및 라킹
            Payment payment = paymentRepository.findByIdForUpdate(event.getPaymentId())
                    .orElseThrow(() -> new EntityNotFoundException("결제 내역을 찾을 수 없습니다."));

            // 2. 이체 내역 상태 성공
            log.info("paymentId={}, 이체 내역 상태 변경 전 ={}", payment.getStatus(), payment.getId());
            payment.markSuccess();
            log.info("paymentId={}, 이체 내역 상태 변경 전 ={}", payment.getStatus(), payment.getId());

            paymentRepository.save(payment);
            log.info("[최종] 펀딩 기뷰페이 이체 성공 - 이체 내역 상태 변경 성공 ");
        } catch (EntityNotFoundException e){
            log.error("❌ 결제 내역 없음 - paymentId={}, fundingId={}", event.getPaymentId(), event.getFundingId());

            // 💡 결제 내역이 없더라도 보상 처리 로직을 강제로 발동시켜야 함
            rollbackBalance(event); // 상태를 FAIL로 처리
        }

    }


    /**
     * 펀딩 기뷰페이 이체 실패
     */
    @Transactional
    public void rollbackBalance (GivuSuccessDTO event){
        log.info("펀딩 기뷰페이 이체 실패 - 펀딩 상태 PENDING으로 변경 시도 ");

        // 1. 이체 내역, 펀딩 존재 확인 및 라킹
        Payment payment = paymentRepository.findByIdForUpdate(event.getPaymentId())
                .orElseThrow(() -> new EntityNotFoundException("결제 내역을 찾을 수 없습니다."));
        Funding funding = fundingRepository.findByIdForUpdate(event.getFundingId())
                .orElseThrow(() -> new EntityNotFoundException("펀딩이 존재하지 않습니다"));

        // ✅ 중복 처리 방지
        if (payment.getStatus() == PaymentsStatus.FAIL) {
            log.warn("⚠️ 이미 FAIL 처리된 결제입니다. 중복 복구 방지: paymentId={}", payment.getId());
            return;
        }

        // 2. 펀딩 상태: PENDING / payment 상태: FAIL
        log.info("funding 상태 변경 전 ={}, payment 상태 변경 전 ={}", funding.getStatus(), payment.getStatus());
        funding.setStatus(FundingsStatus.PENDING);
        payment.markFailed();
        log.info("funding 상태 변경 후 ={}, payment 상태 변경 전 ={}", funding.getStatus(), payment.getStatus());

        fundingRepository.save(funding);
        paymentRepository.save(payment);

        log.info("[최종] 펀딩 기뷰페이 이체 실패 - 펀딩 상태 PENDING으로 변경 성공 ");

        }


}











