import * as React from 'react';
// import Button from 'react-bootstrap/Button';
import Header from 'components/Header';
import BreadCrumbs from 'components/BreadCrumbs';
import Image from "react-bootstrap/Image"
import styles from './DetaliedPage.module.scss'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockProducts } from '../../../consts'
import {useDispatch} from "react-redux";
import { useProduct, useLinksMapData, setProductAction, setLinksMapDataAction } from "../../Slices/DetailedSlice"
import axios from 'axios';

export type ReceivedProductData = {
    id: number,
    name_category: string,
    info: string,
    status: string,
    image: string,
}

const DetailedPage: React.FC = () => {
    const dispatch = useDispatch();
    const product = useProduct();
    const linksMap = useLinksMapData();

    const params = useParams();
    const id = params.id === undefined ? '' : params.id;

    const getProduct = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/categorys/${id}`);
            const jsonData = response.data;
            dispatch(setProductAction({
                id: Number(jsonData.id),
                title: jsonData.name_category,
                info: jsonData.info,
                src: jsonData.image
            }))

            const newLinksMap = new Map<string, string>(linksMap); // Копирование старого Map
            newLinksMap.set(jsonData.title, '/categorys/' + id);
            dispatch(setLinksMapDataAction(newLinksMap))
        } catch {
            const sub = mockProducts.find(item => item.id === Number(id));
            if (sub) {
                dispatch(setProductAction(sub))
            }
        }
    };
    useEffect(() => {
        getProduct();

        return () => { // Возможно лучше обобщить для всех страниц в отдельный Slice !!!
            dispatch(setLinksMapDataAction(new Map<string, string>([['Категории', '/categorys']])))
        }
    }, []);

    return (
        <div className='detailed__page'>
            <Header/>
            <div className={styles['detailed__page-wrapper']} style={{paddingTop: "90px"}}>
                <BreadCrumbs links={linksMap}/>
                <div className={styles['detailed__page-container']}>
                    <Image
                        className={styles['detailed__page-image']}
                        src={product?.src ? product?.src : "https://www.solaredge.com/us/sites/nam/files/Placeholders/Placeholder-4-3.jpg"}
                        rounded
                    />
                    <div className={styles['detailed__page-info']}>
                        <div className={styles['detailed__page-description']}>
                            <h3 className={styles['detailed__page-article']}>Категория:</h3>
                            <p>{product?.title}</p>
                            <h4 className={styles['detailed__page-article']}>Описание:</h4>
                            <p>{product?.info}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
  
export default DetailedPage;