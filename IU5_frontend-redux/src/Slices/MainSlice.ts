import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

// interface CategoryData {
//   id: number;
//   title: string;
// }

interface ProductData {
  id: number;
  title: string;
  info: string;
  src: string;
}

interface DataState {
  titleValue: string;
  products: ProductData[];
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    titleValue: '',
    products: []
  } as DataState,
  reducers: {
    // setCategories(state, action: PayloadAction<CategoryData[]>) {
    //   state.categories = action.payload
    // },
    // setCategoryValue(state, action: PayloadAction<string>) {
    //   state.categoryValue = action.payload
    // },
    setTitleValue(state, action: PayloadAction<string>) {
      state.titleValue = action.payload
    },
    setProducts(state, action: PayloadAction<ProductData[]>) {
      console.log('pay is', action.payload)
      state.products = action.payload
    }
  },
});

// Состояние, которое будем отображать в компонентах
// export const useCategories = () =>
//   useSelector((state: { mainData: DataState }) => state.mainData.categories);

 
export const useTitleValue = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.titleValue);

export const useProducts = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.products);

// Action, который будем применять в различных обработках
export const {
    // setCategories: setCategoriesAction,
    // setCategoryValue: setCategoryValueAction,
    setTitleValue: setTitleValueAction,
    setProducts: setProductsAction
} = dataSlice.actions;

export default dataSlice.reducer;