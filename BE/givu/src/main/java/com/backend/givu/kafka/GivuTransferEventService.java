//package com.backend.givu.kafka;
//
//import com.backend.givu.model.Enum.PaymentsStatus;
//import com.backend.givu.model.entity.Funding;
//import com.backend.givu.model.entity.Payment;
//import com.backend.givu.model.entity.User;
//import com.backend.givu.model.repository.FundingRepository;
//import com.backend.givu.model.repository.PaymentRepository;
//import com.backend.givu.model.repository.UserRepository;
//import com.backend.givu.model.requestDTO.GivuTransferEventDTO;
//import com.backend.givu.model.responseDTO.ApiResponse;
//import com.backend.givu.model.responseDTO.PaymentResultDTO;
//import com.backend.givu.model.service.DeadLetterQueue;
//import com.backend.givu.model.service.PaymentService;
//import jakarta.persistence.EntityNotFoundException;
//import org.springframework.transaction.annotation.Transactional;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.kafka.annotation.KafkaListener;
//import org.springframework.stereotype.Service;
//
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class GivuTransferEventService {
//
//    private final UserRepository userRepository;
//    private final FundingRepository fundingRepository;
//    private final PaymentRepository paymentRepository;
//    private final PaymentService paymentService;
//
//    private final DeadLetterQueue deadLetterQueue;
//
//    @Transactional
//    @KafkaListener(
//            id = "transferListener",
//            topics= "transfer-request",     // 구독중인 토픽명
//            groupId = "transfer-group",     // 해당하는 group
//            concurrency = "3",              // 동시에 실행될 Consumer 쓰레드 수 (동시성 처리용)
//            containerFactory = "kafkaListenerContainerFactory",  // 커스텀 Kafka 설정을 적용한 리스너 팩토리 bean 이름
//            autoStartup = "false"           // 추가: 애플리케이션 시작 시 자동 실행 안 함
//    )
//    public void TransferEvent(GivuTransferEventDTO event){
//
//        log.info("📥 KafkaListener 동작 시작!");
//        log.info("📥 Kafka 메시지 수신: {}", event);
//        log.info("펀딩 아이디 :{}", event.getPaymentId() );
//
//        try {
//
//            /**
//             * 아래 변경 사항들은 트랜잭션 내에서 임시로 유지됨
//             * 예외가 발생하면 트랜잭션이 롤백되며 모두 원복됨 → DB에는 아무것도 반영되지 않음
//             */
//
//            // 1. 유저와 펀딩 잠금(Row-Level Locking)
//            User user = userRepository.findByIdForUpdate(event.getUserId())
//                    .orElseThrow(() -> new EntityNotFoundException("해당하는 유저가 없습니다."));
//            Funding funding = fundingRepository.findByIdForUpdate(event.getFundingId())
//                    .orElseThrow(() -> new EntityNotFoundException("해당하는 펀딩이 없습니다."));
//            Payment payment = paymentRepository.findByIdForUpdate(event.getPaymentId())
//                    .orElseThrow(() -> new EntityNotFoundException("결제 정보가 없습니다: " + event.getPaymentId()));
//            log.info("payment :{} ", payment);
//            log.info("잠금 설정완료");
//
//            // 2. 잔액 부족한 경우
//            if (user.getBalance().compareTo(event.getAmount()) < 0) {
//                log.warn("❌ 잔액 부족 - userId: {}, paymentId: {}", user.getId(), payment.getId());
//                throw new IllegalStateException("잔액이 부족합니다.");
//            }
//
//            // 3. 이체 진행
//            user.setBalance(user.getBalance() - event.getAmount());  // 기뷰페이 차감
//            funding.setFundedAmount(funding.getFundedAmount() + event.getAmount()); //펀딩 모금액 증가
//            log.info("차감, 증가 다 처리 완료");
//
//            // 4. 잔액 업데이트
//            userRepository.save(user);
//            fundingRepository.save(funding);
//
//            //5. 거래 상태 성공으로 업데이트
//            payment.setStatus(PaymentsStatus.SUCCESS);
//            paymentRepository.save(payment);
//            //✅ 트랜잭션 커밋 → 커밋 시점에 락 해제됨
//
//            log.info("✅ 거래 성공 상태로 변경 - paymentId: {}", payment.getId());
//
//
//        }catch (Exception e) {
//            log.error("❌ 처리 중 예외 발생 - paymentId: {}", event.getPaymentId(), e);
//
//
//            // 예외 던지면 Kafka가 retry → 3회 실패 시 errorHandler로 넘어감
//            throw e;
//            // ✅  예외가 던져지면 트랜잭션은 롤백됨
//            // ✅  롤백 시점에 락도 함께 해제됨
//        }
//
//
//
//    }
//}
