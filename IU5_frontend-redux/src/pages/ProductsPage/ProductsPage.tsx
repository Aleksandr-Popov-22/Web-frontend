import * as React from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Header from 'components/Header';
import OneCard from 'components/Card';
import styles from './ProductsPage.module.scss'
import { ChangeEvent } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import SliderFilter from 'components/Slider';
import BreadCrumbs from 'components/BreadCrumbs';
import Loader from 'components/Loader';
import { toast } from 'react-toastify';
import { mockProducts } from '../../../consts';
import {useDispatch} from "react-redux";
import {  useTitleValue, useProducts,
    setTitleValueAction, setProductsAction} from "../../Slices/MainSlice";

import { useLinksMapData, setLinksMapDataAction } from 'Slices/DetailedSlice';

import { useProductsFromApplication, setProductsFromApplicationAction } from 'Slices/ApplicationsSlice';

export type product = {
    id: number,
    title: string,
    info: string,
    src: string,
}

export type ReceivedProductData = {
    id: number,
    name_category: string,
    info: string,
    status: string,
    image: string,
}


export type ReceivedUserData = {
    id: number,
    email: string,
    full_name: string,
    phone_number: string,
    password: string,
    is_superuser: boolean,
}


const ProductsPage: React.FC = () => {
    const dispatch = useDispatch()
    const titleValue = useTitleValue();
    const products = useProducts();
    const productsFromApplication = useProductsFromApplication();
    const linksMap = useLinksMapData();
    const [isLoading, setIsLoading] = React.useState(false)

    // const linksMap = new Map<string, string>([
    //     ['Блюда', '/']
    // ]);

    React.useEffect(() => {
        dispatch(setLinksMapDataAction(new Map<string, string>([
            ['Категории', '/categorys']
        ])))
    }, [])

    const getProducts = async () => {
        let url = 'http://localhost:8000/categorys/'
        if (titleValue) {
            url += `?category=${titleValue}`
            
        }
        try {
            const response = await axios(url, {
                method: 'GET',
                withCredentials: true 
            });
            const jsonData = response.data.categorys;
            const newArr = jsonData.map((raw: ReceivedProductData) => ({
                id: raw.id,
                title: raw.name_category,
                info: raw.info,
                src: raw.image
            }));
            dispatch(setProductsAction(newArr));
        }
        catch {
            console.log('запрос не прошел !')
            if (titleValue) {
                const filteredArray = mockProducts.filter(mockProduct => mockProduct.title.includes(titleValue));
                dispatch(setProductsAction(filteredArray));
            } else {
                dispatch(setProductsAction(mockProducts));
            }
        }
    };

    const postProductToApplication = async (id: number) => {
        try {
            const response = await axios(`http://localhost:8000/categorys/${id}/add`, {
                method: 'POST',
                withCredentials: true,
            })
            const addedProduct = {
                id: response.data.id,
                title: response.data.name_category,
                info: response.data.info,
                src: response.data.image
            }
            console.log(response)
            dispatch(setProductsFromApplicationAction([...productsFromApplication, addedProduct]))
            toast.success("Категория успешно добавлена в заявку!");
        } catch {
            toast.error("Категория уже добавлена в заявку!");
        }
    }

    const handleSearchButtonClick = () => {
        getProducts();
    }

    const handleTitleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setTitleValueAction(event.target.value));
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };


    return (
        <div className={styles['main__page']}>
            <Header/>
            <div className={styles['main__page-wrapper']}>
                <BreadCrumbs links={linksMap}></BreadCrumbs>

               

                <Form className={styles['form']} onSubmit={handleFormSubmit}>
                    <div className={styles.form__wrapper}>
                        {/* <Form.Group controlId="search__sub.input__sub"> */}
                        <div className={styles['form__input-block']}>
                            <Form.Control className={styles.form__input} value={titleValue} onChange={handleTitleValueChange} type="text" placeholder="Введите название категории..." />
                            <Button className={styles.form__button} onClick={() => handleSearchButtonClick()}>Найти</Button>
                        </div>
                        {/* </Form.Group> */}
                        <div className={styles['form__dropdown-wrapper']}>
                            
                            {/* <SliderFilter
                                onChangeValues={handleSliderChange}
                                minimum={0}
                                maximum={10000}
                                currentValues={priceValues}
                                title="Диапазон цен:"
                            /> */}
                        </div>
                        <Button className={styles['form__mobile-button']} onClick={() => handleSearchButtonClick()}>Найти</Button>
                    </div>
                </Form>

                <div className={styles["main__page-cards"]}>
                    {products.map((product: product) => (
                        <OneCard id={product.id} src={product.src} onButtonClick={() => postProductToApplication(product.id)} title={product.title}></OneCard>
                    ))}
                </div>

                {isLoading ? <div className={styles.loader__wrapper}>
                    <Loader className={styles.loader} size='l' />
                 </div>
                 : <div className={styles["main__page-cards"]}>
                    {/* {products.map((product: product) => (
                        <OneCard id={product.id} src={product.src} onButtonClick={() => postProductToApplication(product.id)} title={product.title} price={Number(product.price)}></OneCard>
                    ))} */}
                    </div>
                 }
            </div>
        </div>
    )
};
  
export default ProductsPage;