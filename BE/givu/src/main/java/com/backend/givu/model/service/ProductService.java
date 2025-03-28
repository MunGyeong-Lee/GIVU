package com.backend.givu.model.service;

import com.backend.givu.model.entity.Product;
import com.backend.givu.model.entity.ProductReview;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.ProductRepository;
import com.backend.givu.model.repository.ProductReviewRepository;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.requestDTO.ProductReviewCreateDTO;
import com.backend.givu.model.responseDTO.ProductDetailDTO;
import com.backend.givu.model.responseDTO.ProductReviewDTO;
import com.backend.givu.model.responseDTO.ProductsDTO;
import com.backend.givu.model.responseDTO.UserSimpleInfoDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductReviewRepository productReviewRepository;
    private final UserRepository userRepository;

    public List<ProductsDTO> findAllProduct(){
        List<Product> productList= productRepository.findAll();

        List<ProductsDTO> dtoList = new ArrayList<>();
        for (Product product : productList) {
            dtoList.add(new ProductsDTO(product));
        }
        return dtoList;
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

}
