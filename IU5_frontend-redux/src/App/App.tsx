import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react';
import MainPage from 'pages/MainPage';
import ProductsPage from 'pages/ProductsPage';
import DetaliedPage from 'pages/DetaliedPage';
import RegistrationPage from 'pages/RegistrationPage';
import LoginPage from 'pages/LoginPage';
import CurrentApplicationPage from 'pages/CurrentApplicationPage';
import ApplicationsListPage from 'pages/ApplicationsListPage';
import SelectedApplicationPage from 'pages/SelectedApplicationPage';
import AdminProductsPage from 'pages/AdminProductsPage';
import axios, {AxiosResponse} from 'axios';
import Cookies from "universal-cookie";
import {useDispatch} from "react-redux";
import {setUserAction, setIsAuthAction, useIsAuth, useUser} from "../Slices/AuthSlice";
import { setProductsAction} from "Slices/MainSlice";
import { setCurrentApplicationIdAction } from 'Slices/ApplicationsSlice'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { mockProducts } from '../../consts';
import { setApplicationsAction, setCurrentApplicationDateAction, setProductsFromApplicationAction } from 'Slices/ApplicationsSlice'
import { useCurrentApplicationId } from 'Slices/ApplicationsSlice'
import AdminApplicationsPage from 'pages/AdminApplicationsPage/AdminApplicationsPage';

const cookies = new Cookies();

export type Product = {
    id: number,
    title: string,
    info: string,
    src: string
}

export type ReceivedProductData = {
    id: number,
    name_category: string,
    info: string,
    status: string,
    image: string,
}

function App() {
  const dispatch = useDispatch();
  const isAuth = useIsAuth();
  const user = useUser();

  const getInitialUserInfo = async () => {
    console.log(cookies.get("session_id"))
    try {
      const response: AxiosResponse = await axios('http://localhost:8000/user_info',
      { 
        method: 'GET',
        withCredentials: true, 
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      })

      console.log(response.data)
      dispatch(setIsAuthAction(true))
      dispatch(setUserAction({
        email: response.data.email,
        // fullname: response.data.full_name,
        isSuperuser: response.data.is_superuser
      }))
      
    } 
    catch {
      console.log('Пользоатель не авторизован!!!')
    }
  }

  // const getCategories = async () => {
  //   let url = 'http://127.0.0.1:8000/categories'
  //   try {
  //       const response = await axios.get(url)
  //       const categories = response.data.map((raw: ReceivedCategoryData) => ({
  //           id: raw.id,
  //           title: raw.title
  //       }))
  //       categories.unshift({ id: 100000, title: 'Все категории' });
  //       console.log(categories)
  //       dispatch(setCategoriesAction(categories))
  //   } catch {
  //       console.log('запрос не прошел !')
  //   }
  // }

  const getProducs = async () => {
    try {
        const response = await axios('http://localhost:8000/categorys/', {
            method: 'GET',
            withCredentials: true 
        });
        const products = response.data.categorys;
        if (response.data.sellreq_id) {
          getCurrentApplication(response.data.sellreq_id);
          dispatch(setCurrentApplicationIdAction(response.data.sellreq_id))
        }
        const newArr = products.map((raw: ReceivedProductData) => ({
            id: raw.id,
            title: raw.name_category,
            info: raw.info,
            src: raw.image
                  }));
        dispatch(setProductsAction(newArr));
    }
    catch {
      dispatch(setProductsAction(mockProducts));
    }
};

const getCurrentApplication = async (id: number) => {
  try {
    const response = await axios(`http://localhost:8000/requests/${id}`, {
      method: 'GET',
      withCredentials: true,
    })
    dispatch(setCurrentApplicationDateAction(response.data.sell_req.date_creation))
    const newArr = response.data.products.map((raw: ReceivedProductData) => ({
      id: raw.id,
      title: raw.name_category,
      info: raw.info,
      src: raw.image
  }));

  dispatch(setProductsFromApplicationAction(newArr))
  } catch(error) {
    throw error;
  }
}

// const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//   event.preventDefault();
//   try {
      
//       const response: AxiosResponse = await axios.get('http://localhost:8000/user_info', {
//           withCredentials: true
//       });
//       console.log(response.data)

//       dispatch(setIsAuthAction(true))

//       dispatch(setUserAction({
//           email: response.data.email,
//           fullname: response.data.full_name,
//           phoneNumber: response.data.phone_number,
//           isSuperuser: response.data.is_superuser
//       }));

//   } catch (error) {
//       throw error
//   }
// };

  React.useEffect(() => {
    if (cookies.get("session_id")) {
      getInitialUserInfo();
    }
    getProducs();
  }, [])

  return (
    <div className='app'>
      <HashRouter>
          <Routes>
              <Route path='/' element={<ProductsPage/>}/>
              <Route path="/categorys" element={<ProductsPage />} />
              {isAuth && user.isSuperuser && <Route path="/admin" element={<AdminProductsPage />} />}
              {isAuth && user.isSuperuser && <Route path="/requests" element={<AdminApplicationsPage />} />}
              <Route path="/categorys">
                <Route path=":id" element={<DetaliedPage />} />
              </Route>
              {!isAuth && <Route path='/registration' element={<RegistrationPage/>}></Route>}
              {!isAuth && <Route path='/login' element={<LoginPage/>}></Route>}
              {isAuth && !user.isSuperuser && <Route path='/requests' element={<CurrentApplicationPage/>}/>}
              {isAuth && !user.isSuperuser && <Route path='/requests' element={<ApplicationsListPage/>}></Route>}
              {isAuth && !user.isSuperuser && <Route path="/requests">
                <Route path=":id" element={<SelectedApplicationPage />} />
              </Route>}
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </HashRouter>
      <ToastContainer autoClose={1500} pauseOnHover={false} />
    </div>
    );
  }
  
export default App;