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
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductReviewRepository productReviewRepository;
    private final ProductSearchRepository productSearchRepository;
    private final PaymentService paymentService;
    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;

    public List<ProductsDTO> findAllProduct(){
        List<Product> productList= productRepository.findAll();

        List<ProductsDTO> dtoList = new ArrayList<>();
        for (Product product : productList) {
            dtoList.add(new ProductsDTO(product));
        }
        return dtoList;
    }

    public ApiResponse<List<ProductsDTO>> findAllSearchProduct(String keyword){
        List<ProductDocument> productDocumentList = productSearchRepository.searchProductByKeyword(keyword);

        List<ProductsDTO> dtoList = new ArrayList<>();
        for(ProductDocument product : productDocumentList){
            dtoList.add(new ProductsDTO(product));
        }
        return ApiResponse.success(dtoList);
    }

    public ApiResponse<List<ProductsDTO>> findAllLikeProduct(Long userId) {
        // 1. Redis에서 유저가 좋아요한 상품 ID 가져오기
        Set<String> likedProductIds = getUserLikedProducts(userId);
        if (likedProductIds == null || likedProductIds.isEmpty()) {
            return ApiResponse.success(Collections.emptyList());
        }

        // 2. String → Integer 변환
        List<Integer> productIds = likedProductIds.stream()
                .map(Integer::parseInt)
                .toList();

        // 3. DB에서 상품 정보 조회
        List<Product> products = productRepository.findAllById(productIds);

        // 4. DTO 변환
        List<ProductsDTO> dtoList = products.stream()
                .map(ProductsDTO::new)
                .toList();

        return ApiResponse.success(dtoList);
    }


    public ProductDetailDTO findProductDetailByProductId(int productId, Long userId){
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
        ProductsDTO productsDTO = new ProductsDTO(product);
        List<ProductReviewDTO> reviews = productRepository.findReviewsByProductId(productId);
        // Redis에서 좋아요 수 & 유저가 좋아요 했는지 여부 조회
        long likeCount = getLikeCount(productId);
        boolean likedByUser = (userId != null) && hasLiked(userId, productId);
        boolean permission = (userId != null) && paymentService.checkPermission(userId,productId);

        return new ProductDetailDTO(productsDTO, reviews, (int) likeCount, likedByUser, permission);
    }

    public Product findProductEntity(int productId){
        return productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
    }

    public void saveProductEntity(Product product){
        productRepository.save(product);
    }



    public ProductReviewDTO saveProductReview(long userId, int productId, ProductReviewCreateDTO reviewDTO) throws AccessDeniedException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("유저를 찾을 수 없습니다."));

        boolean permission = paymentService.checkPermission(userId,productId);
        if(!permission) throw new AccessDeniedException("리뷰 작성 권한이 없습니다.");

        if(reviewDTO.getStar() < 1 || reviewDTO.getStar() > 5){
            throw new IllegalArgumentException("별점은 1점 이상 5점 이하만 가능합니다.");
        }
        ProductReview savedReview = productReviewRepository.save(ProductReview.from(user,product,reviewDTO));

        updateProductAverageStar(productId);

        return ProductReview.toDTO(savedReview);
    }



    public ProductReviewDTO updateProductReview(Long userId, int reviewId, ProductReviewCreateDTO dto, int productId) throws AccessDeniedException {
        ProductReview review = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("리뷰를 찾을 수 없습니다."));

        // 본인 리뷰인지 검증
        if (!review.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("리뷰 수정 권한이 없습니다.");
        }
        if(review.getStar() < 1 || review.getStar() > 5){
            throw new IllegalArgumentException("별점은 1점 이상 5점 이하만 가능합니다.");
        }

        review.setTitle(dto.getTitle());
        review.setBody(dto.getBody());
        review.setStar(dto.getStar());

        if (dto.getImage() != null) {
            review.setImage(dto.getImage());
        }
        ProductReview savedReview = productReviewRepository.save(review);

        updateProductAverageStar(productId);

        return ProductReview.toDTO(savedReview);
    }

    public void deleteReview(long userId, int reviewId, int productId) throws AccessDeniedException {
        ProductReview review = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("리뷰를 찾을 수 없습니다."));
        // 본인 리뷰인지 검증
        if (!review.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("리뷰 삭제 권한이 없습니다.");
        }
        productReviewRepository.deleteById(reviewId);
        updateProductAverageStar(productId);
    }


    @Transactional(readOnly = true)
    public void indexAllProductsToElasticsearch() {
        List<Product> products = productRepository.findAll();

        List<ProductDocument> documents = products.stream()
                .map(ProductMapper::toDocument)
                .toList();

        productSearchRepository.saveAll(documents); // ES에 대량 색인
    }

    private String getProductLikeKey(Integer productId){
        return "product:like:" + productId;
    }
    private String getUserLikeKey(Long userId){
        return "user:like:" + userId;
    }

    // 좋아요 누르기
    public void likeProduct(Long userId, Integer productId) {
        redisTemplate.opsForSet().add(getProductLikeKey(productId), userId.toString());
        redisTemplate.opsForSet().add(getUserLikeKey(userId), productId.toString());
    }

    // 좋아요 취소
    public void unlikeProduct(Long userId, Integer productId) {
        redisTemplate.opsForSet().remove(getProductLikeKey(productId), userId.toString());
        redisTemplate.opsForSet().remove(getUserLikeKey(userId), productId.toString());
    }

    // 해당 유저가 특정 상품을 좋아요했는지
    public boolean hasLiked(Long userId, Integer productId) {
        Boolean result = redisTemplate.opsForSet().isMember(getProductLikeKey(productId), userId.toString());
        return result != null && result;
    }

    // 특정 상품의 좋아요 수
    public long getLikeCount(Integer productId) {
        Long size = redisTemplate.opsForSet().size(getProductLikeKey(productId));
        return size != null ? size : 0;
    }

    // 유저가 좋아요한 상품 목록
    public Set<String> getUserLikedProducts(Long userId) {
        return redisTemplate.opsForSet().members(getUserLikeKey(userId));
    }

    // 특정 상품을 좋아요한 유저 목록
    public Set<String> getProductLikedUsers(Integer productId) {
        return redisTemplate.opsForSet().members(getProductLikeKey(productId));
    }

    private void updateProductAverageStar(int productId) {
        Double avg = productReviewRepository.findAverageStarByProductId(productId);
        if (avg == null) avg = 0.0;

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
        product.setStar(avg);
        productRepository.save(product);
    }


}
