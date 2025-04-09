package com.backend.givu.kafka.cancel;

import com.backend.givu.model.Enum.ParticipantsRefundStatus;
import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.Enum.PaymentsTransactionType;
import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Participant;
import com.backend.givu.model.entity.Payment;
import com.backend.givu.model.entity.RefundFailLog;
import com.backend.givu.model.repository.FundingRepository;
import com.backend.givu.model.repository.ParticipantRepository;
import com.backend.givu.model.repository.PaymentRepository;
import com.backend.givu.model.repository.RefundFailLogRepository;
import com.backend.givu.model.requestDTO.RefundEventDTO;
import com.backend.givu.model.requestDTO.RefundResultEventDTO;
import com.backend.givu.model.responseDTO.ApiResponse;
import com.backend.givu.model.responseDTO.RefundResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefundFundingService {
    private final FundingRepository fundingRepository;
    private final ParticipantRepository participantRepository;
    private final PaymentRepository paymentRepository;
    private final RefundFailLogRepository refundFailLogRepository;

    private final RefundFundingProducer refundFundingProducer;

    /**
     * 펀딩 취소 -> 참가자 리스트 뽑고 한명씩 처리하기
     */
    @Transactional
    public ApiResponse<RefundResponseDTO> refundFunding(Long userId, int fundingId){
        // 1. 펀딩 유무 확인
        Funding funding = fundingRepository.findByIdForUpdate(fundingId)
                .orElseThrow(()-> new EntityNotFoundException("펀딩을 찾을 수 없습니다."));
        // 2. 펀딩 참가자 리스트
        List<Participant> participants = participantRepository.findByFunding_Id(fundingId);

        for(Participant participant : participants){
            try {
                refundForOneParticipant(participant); // 이 메서드에 @Transactional 적용
            } catch (Exception e) {
                log.warn("⚠️ 환불 실패: userId={}, reason={}", participant.getUser().getId(), e.getMessage());
                // 실패 이력 저장
                refundFailLogRepository.save(new RefundFailLog(
                        participant.getUser().getId(),
                        funding.getId(),
                        participant.getFundingAmount(),
                        e.getMessage()
                ));
            }

        }
        RefundResponseDTO responseDTO = new RefundResponseDTO(userId, fundingId);
        return ApiResponse.success(responseDTO);

    }


    /**
     * 리스트에서 나온 개별 참여자들의 환불 처리
     */
    @Transactional
    public void refundForOneParticipant(Participant participant) {

        Funding funding = participant.getFunding();
        int amount = participant.getFundingAmount();
        Long userId = participant.getUser().getId();
        log.info("펀딩한 금액={}",amount);

        // 1. 펀딩 총액 차감
        log.info("펀딩모금액 차감 전={}",funding.getFundedAmount());
        funding.subtractFundedAmount(amount); // 예: fundedAmount -= amount;
        log.info("펀딩모금액 차감 후={}",funding.getFundedAmount());

        // 2. Payment 기록
        Payment payment = Payment.builder()
                .user(participant.getUser())
                .relatedFunding(funding)
                .relatedProduct(null)
                .amount(amount)
                .status(PaymentsStatus.PENDING)
                .transactionType(PaymentsTransactionType.REFUND)
                .build();

        paymentRepository.save(payment);

        // 3. Kafka 이벤트 발행 (환불 요청)
        refundFundingProducer.send(
                funding.getId(), // key: partition 유지용
                new RefundEventDTO(userId, funding.getId(),payment.getId(), amount)
        );
        // → 예외 발생 시 여기서 catch 안 하고 그대로 밖으로 throw 됨
    }

    /**
     * 환불 성공 이벤트처리
     */
    @Transactional
    public void handleRefundSuccess(RefundResultEventDTO event) {
        log.info("환불 성공 처리 - 환불 내역 상태, participant 상태 변경 시도");
        Payment payment = paymentRepository.findByIdForUpdate(event.getPaymentId())
                .orElseThrow(() -> new EntityNotFoundException("결제 내역을 찾을 수 없습니다."));

        // 1. 환불 내역 상태 - 성공
        payment.markSuccess();

        // 2. participant 상태 - 환불
        Participant participant = participantRepository.findRefundMatch(
                event.getUserId(),event.getFundingId(), event.getAmount())
                        .orElseThrow(()-> new EntityNotFoundException("참여자 정보가 없습니다."));
        participant.setStatus(ParticipantsRefundStatus.REFUND);

        log.info("✅ [환불 성공 처리] paymentId={}, participantId={}, userId={}, fundingId={}",
                payment.getId(), participant.getId(), event.getUserId(), event.getFundingId());
    }




    /**
     * 환불 실패 이벤트 처리
     */
    @Transactional
    public void rollbackBalance(RefundResultEventDTO event) {
        log.info("환불 실패 처리 - 펀딩 금액 복구 시도");
        Payment payment = paymentRepository.findByIdForUpdate(event.getPaymentId())
                .orElseThrow(() -> new EntityNotFoundException("결제 내역을 찾을 수 없습니다."));


        // ✅ 중복 처리 방지
        if (payment.getStatus() == PaymentsStatus.FAIL) {
            log.warn("⚠️ 이미 FAIL 처리된 결제입니다. 중복 복구 방지: paymentId={}", payment.getId());
            return;
        }

        // 환불 상태 실패로 돌리기
        payment.markFailed();


        // 펀딩 금액 복구
        Funding funding = payment.getRelatedFunding();

        log.info("펀딩 금액 복구 전 ={}", funding.getFundedAmount());
        funding.addFundedAmount(payment.getAmount());
        log.info("펀딩 금액 복구 후 ={}", funding.getFundedAmount());

        log.info("🔁 [환불 실패 복구] payment FAIL 처리 & 펀딩 금액 롤백 완료: paymentId={}, fundingId={}, rollbackAmount={}",
                payment.getId(), funding.getId(), payment.getAmount());
    }






}
