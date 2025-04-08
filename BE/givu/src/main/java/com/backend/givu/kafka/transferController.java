package com.backend.givu.kafka;

import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.responseDTO.ApiResponse;
import com.backend.givu.model.responseDTO.PaymentResultDTO;
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






}

