package com.backend.givu.controller;

import com.backend.givu.model.entity.Product;
import com.backend.givu.model.requestDTO.ProductReviewCreateDTO;
import com.backend.givu.model.responseDTO.ImageUploadResponseDTO;
import com.backend.givu.model.responseDTO.ProductDetailDTO;
import com.backend.givu.model.responseDTO.ProductReviewDTO;
import com.backend.givu.model.responseDTO.ProductsDTO;
import com.backend.givu.model.service.ProductService;
import com.backend.givu.model.service.S3UploadService;
import com.backend.givu.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "Product", description = "상품(GIVU몰) 관련 API")
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final S3UploadService s3UploadService;
    private final JwtUtil jwtUtil;

    @Operation(summary = "상품 전체 리스트 조회", description = "상품 전체 목록을 조회합니다.")
    @GetMapping("/list")
    public ResponseEntity<List<ProductsDTO>> findAll() {
        List<ProductsDTO> productList = productService.findAllProduct();
        return ResponseEntity.ok(productList);
    }

    @Operation(summary = "상품 상세 조회", description = "상품 상세 정보를 조회합니다.")
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDetailDTO> findProduct(@PathVariable int productId) {
        ProductDetailDTO product = productService.findProductDetailByProductId(productId);
        return ResponseEntity.ok(product);
    }

    @Operation(summary = "상품 이미지 업로드", description = "파일과 productId를 받아 이미지를 업로드합니다.")
    @PutMapping(value = "/{productId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponseDTO> updateProductImage(@PathVariable int productId,
                                                                     @Parameter(description = "업로드할 이미지 파일")
                                                                     @RequestPart("file") MultipartFile file) {
        try {
            // S3에 imageURL로 상품 ID 알아볼 수 있게 저장
            String imageUrl = s3UploadService.uploadFile(file, "products/" + productId);

            // 해당 product 조회
            Product product = productService.findProductEntity(productId);

            // img url 바꾸기
            product.setImage(imageUrl);
            productService.saveProductEntity(product);

            return ResponseEntity.ok(new ImageUploadResponseDTO(imageUrl));
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ImageUploadResponseDTO(null, "이미지 업로드에 실패했습니다."));
        }
    }
}
