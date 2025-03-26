package com.backend.givu.model.service;

import com.backend.givu.model.entity.Product;
import com.backend.givu.model.repository.ProductRepository;
import com.backend.givu.model.responseDTO.ProductsDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductsDTO> findAllProduct(){
        List<Product> productList= productRepository.findAll();

        List<ProductsDTO> dtoList = new ArrayList<>();
        for (Product product : productList) {
            dtoList.add(new ProductsDTO(product));
        }
        return dtoList;
    }

    public ProductsDTO findProduct(int productId){
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
        return new ProductsDTO(product);
    }

    public Product findProductEntity(int productId){
        return productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
    }

    public void saveProductEntity(Product product){
        productRepository.save(product);
    }

}
