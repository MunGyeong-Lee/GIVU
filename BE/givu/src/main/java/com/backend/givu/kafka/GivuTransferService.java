package com.backend.givu.kafka;


import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.Enum.PaymentsTransactionType;
import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Payment;
import com.backend.givu.model.entity.Product;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.FundingRepository;
import com.backend.givu.model.repository.PaymentRepository;
import com.backend.givu.model.repository.ProductRepository;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.requestDTO.OrderCreatedEventDTO;
import com.backend.givu.model.responseDTO.ApiResponse;
import com.backend.givu.model.responseDTO.PaymentResultDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GivuTransferService {

    private final FundingRepository fundingRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;

    private final GivuProducer givuProducer;

    /**
     * 기뷰페이 잔액 차감
     */
    @Transactional
    public ApiResponse<PaymentResultDTO> fundingPayment(Long userId, int fundingId, int amount) {
        // 1. 해당 펀딩이 있는지 확인
        Funding funding = fundingRepository.findById(fundingId)
                .orElseThrow(() -> new EntityNotFoundException("펀딩을 찾을 수 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("유저를 찾을 수 없습니다."));
        int fundingBalance = funding.getProduct().getPrice() - funding.getFundedAmount();

        // 2. 거래내역 생성 및 pending 상태로 저장
        Payment payment = Payment.builder() //serId, fundingId, amount, PaymentsStatus.PENDING);
                .user(user)
                .relatedFunding(funding)
                .relatedProduct(null)
                .amount(amount)
                .status(PaymentsStatus.PENDING)
                .transactionType(PaymentsTransactionType.FUNDING)
                .build();
        paymentRepository.save(payment);

        log.info("현재 유저의 잔액: {}", user.getBalance());

        // 3. 잔액 부족한 경우
        if (user.getBalance().compareTo(amount) < 0) {
            log.warn("❌ 잔액 부족 - userId: {}, paymentId: {}", user.getId(), payment.getId());
            return ApiResponse.fail("LACK_BALANCE", "잔액이 부족합니다.");
        }
        // 펀딩 잔액 보다 많은 금액을 펀딩하려는 경우
        if (fundingBalance < amount) {
            log.warn("❌ 펀딩 잔액 이상 - userId: {}, paymentId: {}", user.getId(), payment.getId());
            return ApiResponse.fail("EXCEED_FUNDING", "펀딩 잔액 이상의 금액을 펀딩할 수 없습니다.");
        }

        // 4. 결제 금액만큼 balance에서 빼기
        user.setBalance(user.getBalance() - amount);
        log.info("현재 유저의 잔액(balance에서 빼기 후): {}", user.getBalance());
        userRepository.save(user);

        // 5. 트랜잭션이 끝난 이후 Kafka 발행 (이 부분은 예외 없이 정상 실행된 이후에만 실행됨)
        givuProducer.sendKafkaEventAfterCommit(payment, userId);

        // 6. 클라이언트 응답 DTO 생성
        PaymentResultDTO dto = new PaymentResultDTO(payment);
        return ApiResponse.success(dto);


    }


    /**
     * 펀딩 성공 처리 이벤트 수신 -> 결제 상태 SCCESS
     */
    @Transactional
    public void confirmPayment(int transactionId){

        // 1. 펀딩 내역 존재하는지 확인
        Payment payment = paymentRepository.findById(transactionId)
                .orElseThrow(() -> new EntityNotFoundException("결제 정보가 없습니다: " + transactionId));

        // 2. 결제 상태 성공으로 반영
        payment.setStatus(PaymentsStatus.SUCCESS);
        paymentRepository.save(payment);
        log.info("✅ 결제 최종 완료 - userId: {}, transactionId: {}, status: {}",
                payment.getUser().getId(), payment.getId(), payment.getStatus());
    }




    /**
     * 펀딩 실패 처리 이벤트 수신 -> 결제 상태 FAIL
     */
    @Transactional
    public void rollbackBalance(Long userId, int amount, int transactionId){
        log.info("🔁 보상 시작 - userId: {}, transactionId: {}, amount: {}", userId, transactionId, amount);

        // 1.  유저 정보, 결제 정보 존재 하는지 확인
        User user = userRepository.findById(userId)
            .orElseThrow(()-> new EntityNotFoundException("유저 정보가 없습니다."));
        Payment payment = paymentRepository.findById(transactionId)
                .orElseThrow(()-> new EntityNotFoundException("결제 정보가 없습니다." + transactionId));


        if (payment.getStatus() == PaymentsStatus.FAIL) {
            log.warn("⚠️ 이미 FAIL 처리된 결제 - 보상 중단: paymentId={}", transactionId);
            return;
        }

        // 2. 유저의 기뷰페이 잔액 증가
        log.info("현재 유저의 잔액 (보상 전): {}", user.getBalance());
        user.setBalance(user.getBalance() + amount);
        log.info("현재 유저의 잔액 (보상 후): {}", user.getBalance());

        // 3. 결제 내역 실패로 돌리기
        payment.setStatus(PaymentsStatus.FAIL);

        // 4.  저장
        userRepository.save(user);
        paymentRepository.save(payment);

        log.info("✅ 보상 완료 - userId: {}, paymentId: {} 잔액 복구 및 상태 FAIL 처리 완료", userId, transactionId);


    }


    @Transactional
    public ApiResponse<PaymentResultDTO> purchaseProduct(Long userId, int productId, int amount) {
        // 1. 유저 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("유저 정보를 찾을 수 없습니다."));

        // 2. 상품 조회
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("상품 정보를 찾을 수 없습니다."));

        // 3. 결제 엔티티 생성 (PENDING 상태)
        Payment payment = Payment.builder()
                .user(user)
                .relatedProduct(product)
                .relatedFunding(null)
                .amount(amount)
                .status(PaymentsStatus.PENDING)
                .transactionType(PaymentsTransactionType.PRODUCT)
                .build();

        paymentRepository.save(payment);

        log.info("📥 결제 요청 생성 - paymentId: {}, userId: {}, 금액: {}", payment.getId(), userId, amount);

        // 4. Kafka 이벤트 발행 (트랜잭션 커밋 이후)
        OrderCreatedEventDTO event = new OrderCreatedEventDTO();
        event.setUserId(userId);
        event.setProductId(productId);
        event.setPaymentId(payment.getId());
        event.setTotalAmount(amount);
        event.setPaymentMethod("BALANCE"); // 예: 잔액 결제 방식

        givuProducer.sendKafkaEventAfterCommit(event);

        // 5. 응답 생성
        PaymentResultDTO dto = new PaymentResultDTO(payment);
        return ApiResponse.success(dto);
    }





}






//
//
//
//
//    @Transactional
//    public ApiResponse<PaymentResultDTO> fundingTransfer(Long userId, int fundingId, int amount){
//
//
//        // 1. 해당 펀딩이 있는지 확인
//        Funding funding = fundingRepository.findById(fundingId)
//                .orElseThrow(()-> new EntityNotFoundException("펀딩을 찾을 수 없습니다."));
//
//        User user = userRepository.findById(userId)
//                .orElseThrow(()-> new EntityNotFoundException("유저를 찾을 수 없습니다."));
//
//        // 2. 거래내역 생성 및 pending 상태로 저장
//        Payment payment = Payment.builder() //serId, fundingId, amount, PaymentsStatus.PENDING);
//                .user(user)
//                .relatedFunding(funding)
//                .relatedProduct(null)
//                .amount(amount)
//                .status(PaymentsStatus.PENDING)
//                .transactionType(PaymentsTransactionType.FUNDING)
//                .build();
//        paymentRepository.save(payment);
//
//        // 3. 트랜잭션이 끝난 이후 Kafka 발행
//        sendKafkaEventAfterCommit(payment, userId);
//
//        // 4. 클라이언트 응답 DTO 생성
//        PaymentResultDTO dto = new PaymentResultDTO(payment);
//        return ApiResponse.success(dto);
//    }
//
//



