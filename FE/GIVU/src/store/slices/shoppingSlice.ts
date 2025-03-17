import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 상품 타입 정의
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  discount: number;
}

// 장바구니 아이템 타입 정의
interface CartItem {
  product: Product;
  quantity: number;
}

// 상태 타입 정의
interface ShoppingState {
  cart: CartItem[];
  selectedCategory: string | null;
}

// 초기 상태
const initialState: ShoppingState = {
  cart: [],
  selectedCategory: null,
};

// 슬라이스 생성
const shoppingSlice = createSlice({
  name: 'shopping',
  initialState,
  reducers: {
    // 카테고리 선택
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    
    // 장바구니에 상품 추가
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.cart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ product, quantity: 1 });
      }
    },
    
    // 장바구니에서 상품 제거
    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.cart = state.cart.filter(item => item.product.id !== productId);
    },
    
    // 장바구니 상품 수량 변경
    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find(item => item.product.id === productId);
      
      if (item) {
        item.quantity = Math.max(1, quantity); // 최소 수량은 1
      }
    },
    
    // 장바구니 비우기
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

// 액션 생성자 내보내기
export const { setCategory, addToCart, removeFromCart, updateQuantity, clearCart } = shoppingSlice.actions;

// 리듀서 내보내기
export const shoppingReducer = shoppingSlice.reducer;