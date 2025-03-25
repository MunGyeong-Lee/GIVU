package com.backend.givu.controller;

import com.backend.givu.model.entity.Product;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.responseDTO.ProductsDTO;
import com.backend.givu.model.responseDTO.UserInfoDTO;
import com.backend.givu.model.service.ProductService;
import com.backend.givu.util.DateTimeUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@Tag(name = "Product", description = "상품(GIVU몰) 관련 API")
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @Operation(summary = "상품 전체 리스트 조회", description = "상품 전체 목록을 조회합니다.")
    @GetMapping("/list")
    public ResponseEntity<List<ProductsDTO>> findAll(){
        List<ProductsDTO> productList = productService.findAllProduct();
        return ResponseEntity.ok(productList);
    }

    @Operation(summary = "상품 상세 조회", description = "상품 상세 정보를 조회합니다.")
    @GetMapping("/{productId}")
    public ResponseEntity<ProductsDTO> findProduct(@PathVariable int productId){
        ProductsDTO product = productService.findProduct(productId);
        return ResponseEntity.ok(product);
    }
}
