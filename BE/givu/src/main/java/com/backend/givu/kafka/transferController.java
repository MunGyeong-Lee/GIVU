package com.backend.givu.kafka;

import com.backend.givu.kafka.payment.GivuTransferService;
import com.backend.givu.kafka.refund.RefundFundingService;
import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.responseDTO.ApiResponse;
import com.backend.givu.model.responseDTO.PaymentResultDTO;
import com.backend.givu.model.responseDTO.RefundResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Tag(name = "Transfer", description = "이체관련 API")
@RestController
@RequestMapping("/transfer")
@RequiredArgsConstructor
@Slf4j
public class transferController {

    private final GivuTransferService givuTransferService;
    private final RefundFundingService refundFundingService;
    @Operation(summary = "펀딩하기(결제)", description = "해당 펀딩에 펀딩을 합니다(기뷰페이 -> 펀딩)")
    @PostMapping(value="/{fundingId}")
    public ResponseEntity<ApiResponse<PaymentResultDTO>> givuTransfer(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable int fundingId,
            @RequestParam int amount,
            HttpServletRequest request)throws IOException {
        Long userId = userDetail.getId();
        ApiResponse<PaymentResultDTO> fundingTransfer = givuTransferService.fundingPayment(userId, fundingId, amount);
        return ResponseEntity.ok(fundingTransfer);
    }


    @Operation(summary = "펀딩 취소하기 (환불/50% 이하)", description = "해당 펀딩에 취소합니다(펀딩 -> 기뷰페이)")
    @PostMapping(value="/{fundingId}/refund")
    public ResponseEntity<ApiResponse<RefundResponseDTO>> refundFunding(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable int fundingId,
            HttpServletRequest request) throws IOException{
        Long userId = userDetail.getId();
        ApiResponse<RefundResponseDTO> refundFunding = refundFundingService.refundFunding(userId, fundingId);
        return ResponseEntity.ok(refundFunding);
    }



//    @Operation(summary = "펀딩 성공 (기뷰페이 환급/50% 초과)", description = "해당 펀딩에 취소합니다(펀딩 -> 기뷰페이)")
//    @PostMapping(value="/{fundingId}/complete")









}

