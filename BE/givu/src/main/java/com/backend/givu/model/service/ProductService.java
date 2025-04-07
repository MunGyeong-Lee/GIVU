package com.backend.givu.model.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.backend.givu.model.Document.ProductDocument;
import com.backend.givu.model.entity.Product;
import com.backend.givu.model.entity.ProductReview;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.ProductRepository;
import com.backend.givu.model.repository.ProductReviewRepository;
import com.backend.givu.model.repository.ProductSearchRepository;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.requestDTO.ProductReviewCreateDTO;
import com.backend.givu.model.responseDTO.*;
import com.backend.givu.util.mapper.ProductMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductReviewRepository productReviewRepository;
    private final ProductSearchRepository productSearchRepository;
    private final UserRepository userRepository;

    public List<ProductsDTO> findAllProduct(){
        List<Product> productList= productRepository.findAll();

        List<ProductsDTO> dtoList = new ArrayList<>();
        for (Product product : productList) {
            dtoList.add(new ProductsDTO(product));
        }
        return dtoList;
    }

    public ApiResponse<List<ProductsDTO>> findAllSearchProduct(String name, String description){
        List<ProductDocument> productDocumentList = productSearchRepository.findByProductNameContainingOrDescriptionContaining(name, description);

        List<ProductsDTO> dtoList = new ArrayList<>();
        for(ProductDocument product : productDocumentList){
            dtoList.add(new ProductsDTO(product));
        }
        return ApiResponse.success(dtoList);
    }

    public ProductDetailDTO findProductDetailByProductId(int productId){
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
        ProductsDTO productsDTO = new ProductsDTO(product);
        List<ProductReviewDTO> reviews = productRepository.findReviewsByProductId(productId);
        return new ProductDetailDTO(productsDTO, reviews);
    }

    public Product findProductEntity(int productId){
        return productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
    }

    public void saveProductEntity(Product product){
        productRepository.save(product);
    }
    public ProductReviewDTO saveProductReview(long userId, int productId, ProductReviewCreateDTO reviewDTO){
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("유저를 찾을 수 없습니다."));

        ProductReview savedReview = productReviewRepository.save(ProductReview.from(user,product,reviewDTO));
        return ProductReview.toDTO(savedReview);
    }

    public ProductReviewDTO updateProductReview(Long userId, int reviewId, ProductReviewCreateDTO dto) throws AccessDeniedException {
        ProductReview review = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("리뷰를 찾을 수 없습니다."));

        // 본인 리뷰인지 검증
        if (!review.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("리뷰 수정 권한이 없습니다.");
        }

        review.setTitle(dto.getTitle());
        review.setBody(dto.getBody());
        review.setStar(dto.getStar());

        if (dto.getImage() != null) {
            review.setImage(dto.getImage());
        }

        return ProductReview.toDTO(productReviewRepository.save(review));
    }

    public void deleteReview(long userId, int reviewId) throws AccessDeniedException {
        ProductReview review = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("리뷰를 찾을 수 없습니다."));
        // 본인 리뷰인지 검증
        if (!review.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("리뷰 삭제 권한이 없습니다.");
        }

        productReviewRepository.deleteById(reviewId);
    }

    @Transactional
    public void increaseLikeCount(int productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다"));

        product.increaseLike(); // 도메인 메서드로 처리 추천!
    }

    @Transactional(readOnly = true)
    public void indexAllProductsToElasticsearch() {
        List<Product> products = productRepository.findAll();

        List<ProductDocument> documents = products.stream()
                .map(ProductMapper::toDocument)
                .toList();

        productSearchRepository.saveAll(documents); // ES에 대량 색인
    }


}
