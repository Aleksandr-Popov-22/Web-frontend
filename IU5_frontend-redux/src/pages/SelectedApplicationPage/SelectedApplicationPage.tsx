import React from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './SelectedApplicationPage.module.scss'
import Header from 'components/Header'
import ProductsTable from 'components/ProductsTable'
import BreadCrumbs from 'components/BreadCrumbs';
import { useDispatch } from 'react-redux';
import { useLinksMapData, setLinksMapDataAction } from 'Slices/DetailedSlice';

export type ReceivedProductData = {
  id: number,
  name_category: string,
  info: string,
  status: string,
  image: string,
}

const SelectedApplicationPage = () => {
    const params = useParams();
    const id = params.id === undefined ? '' : params.id;
    const [currentProduct, setCurrentProduct] = React.useState([])
    const dispatch = useDispatch();
    const linksMap = useLinksMapData();

    const getCurrentApplication = async () => {
        try {
          const response = await axios(`http://localhost:8000/requests/${id}`, {
            method: 'GET',
            withCredentials: true,
          })

          const newArr = response.data.categorys.map((raw: ReceivedProductData) => ({
            id: raw.id,
            title: raw.name_category,
            info: raw.info,
            src: raw.image
        }));
        setCurrentProduct(newArr)
        } catch(error) {
          throw error;
        }
      }

    React.useEffect(() => {
        const newLinksMap = new Map<string, string>(linksMap); // Копирование старого Map
        newLinksMap.set(id, '/requests/' + id);
        dispatch(setLinksMapDataAction(newLinksMap))
        getCurrentApplication();

    }, [])

    return (
        <div className={styles.application__page}>
            <Header/>
            <div className={styles['application__page-wrapper']}>
                <BreadCrumbs links={linksMap}></BreadCrumbs>
                <h1 className={styles['application__page-title']}>
                    Добавленные категории
                </h1>
                
                <ProductsTable flag={true} products={currentProduct} className={styles['application__page-table']}/>
            </div>
        </div>
    )
}

export default SelectedApplicationPage