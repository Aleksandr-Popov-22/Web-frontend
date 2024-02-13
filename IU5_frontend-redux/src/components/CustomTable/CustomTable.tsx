import React, { useState, ChangeEvent } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
// import cn from 'classnames';
import styles from './CustomTable.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import AddButton from 'components/Icons/AddButton';
import EditIcon from 'components/Icons/EditIcon';
import BasketIcon from 'components/Icons/BasketIcon';
import ModalWindow from 'components/ModalWindow';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import ArrowDownIcon from 'components/Icons/ArrowDownIcon';
import { useTitleValue, useProducts,
   setTitleValueAction, setProductsAction} from "../../Slices/MainSlice";
import { useDispatch } from 'react-redux';
import ImageIcon from 'components/Icons/ImageIcon';

export type ReceivedProductData = {
  id: number,
  name_category: string,
  info: string,
  status: string,
  image: string,
}

type ColumnData = {
  key: string;
  title: string;
}

export type TableData = {
  columns: ColumnData[];
  data: any[];
  children?: React.ReactNode;
  flag: 0 | 1 | 2 | 3;
  className?: string;
  // handleUsersButtonCLick?: (event: EventData) => void;
  // handleChangeButtonClick?: (event: EventData) => void;
  // handleDeleteButtonClick?: () => void;
};

export type ProductData =  {
  id: number,
  title: string,
  info: string,
  src: string
};

const CustomTable: React.FC<TableData> = ({columns, data, className}) => {
  const products = useProducts()
  const dispatch = useDispatch()

  const [isAddModalWindowOpened, setIsAddModalWindowOpened] = useState(false)
  const [isEditModalWindowOpened, setIsEditModalWindowOpened] = useState(false)
  const [isDeleteModalWindowOpened, setIsDeleteModalWindowOpened] = useState(false)
  const [isImageModalWindowOpened, setIsImageModalWindowOpened] = useState(false)

  const [productTitleValue, setProductTitleValue] = useState('')
  const [productInfoValue, setProductInfoValue] = useState('')
  const [currentProductId, setCurrentProductId] = useState<number>()
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState('')


  const postProduct = async () => {
    try {
      const response = await axios(`http://localhost:8000/categorys/new`, {
        method: 'POST',
        data: {
          name_category: productTitleValue,
          info: productInfoValue
        },
        withCredentials: true
      })
      setIsAddModalWindowOpened(false)

      dispatch(setProductsAction([...products, {
        id: response.data.id,
        title:  response.data.name_category,
        info: response.data.info,
        src: ''
      }]))
      toast.success('Категория успешно добавлена!')
    } catch(e) {
      toast.error('Категория уже существует!')
    }
  }

  const putProduct = async (id: number) => {
    try {
      const response = await axios(`http://localhost:8000/categorys/${id}/put`, {
        method: 'PUT',
        data: {
          title: productTitleValue,
          info: productInfoValue,
          status: "Действует"
        },
        withCredentials: true
      })
      setIsEditModalWindowOpened(false)
      const updatedProducts = products.map(product => {
        if (product.id === id) {
          return {
            ...product,
            title: response.data.title,
            info: response.data.info,
            src: response.data.src
          };
        }
        return product;
      });

      dispatch(setProductsAction(updatedProducts))
      toast.success('Информация успешно обновлена!')
    } catch(e) {
      toast.error('Категория с таким названием уже существует!')
    }
  }
  
  const deleteProduct = async () => {
    try {
      await axios(`http://localhost:8000/categorys/${currentProductId}/delete`, {
        method: 'DELETE',
        withCredentials: true,

      })

      dispatch(setProductsAction(products.filter((product) => {
        return product.id !== currentProductId 
      })))
      setIsDeleteModalWindowOpened(false)
      toast.success('Категория успешно удалена!')
    } catch(e) {
      throw e
    }
  }

  const handleUpload = async () => {
    if (selectedImage) {
      try {
        const formData = new FormData();
        formData.append('file', selectedImage);

        const response = await axios.put(
          `http://localhost:8000/categorys/${currentProductId}/put`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );
        const updatedProducts = products.map(product => {
          if (product.id === currentProductId) {
            return {
              ...product,
              src: response.data
            };
          }
          return product;
        });
        dispatch(setProductsAction(updatedProducts))
        console.log(updatedProducts)
        setSelectedImage(null)
        toast.success('Изображение успешно загружено')

      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsImageModalWindowOpened(false)
      }
    }
  };

  const handleProductFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isAddModalWindowOpened) {
      postProduct()
    } else if(currentProductId) {
      putProduct(currentProductId)
    }
  }

  const handleEditButtonClick = (product: ProductData) => {
    setCurrentProductId(product.id)
    setIsEditModalWindowOpened(true);
    setProductTitleValue(product.title)
    setProductInfoValue(product.info)
  }

  const handleDeleteButtonClick = (id: number) => {
    setCurrentProductId(id)
    setIsDeleteModalWindowOpened(true)
  }

  const handleImageButtonClick = (product: ProductData) => {
    setCurrentProductId(product.id)
    setIsImageModalWindowOpened(true)
    setCurrentImage(product.src)
  }

  // const handleCategorySelect = (eventKey: string | null) => {
  //   if (eventKey !== null) {
  //     const selectedCategory = categories.find(category => category.id === parseInt(eventKey, 10));
  //     if (selectedCategory && selectedCategory.id !== categoryValue?.id && selectedCategory) {
  //       setCategoryValue(selectedCategory)
  //     }
  //   }
  // };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <>
      <div className={`${styles.table__container} ${className}`}>
      <div className={`${styles.table__add} ${className}`}>
      <span className={`${styles['table__add-text']}`}>Добавить новую категорию</span><AddButton onClick={() => setIsAddModalWindowOpened(true)}/>
      </div>
      <Table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.title}</th>
              ))}
              {<th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex}>{row[column.key]}</td>
                ))}
                <td className={styles.table__action}>
                  <EditIcon onClick={() => handleEditButtonClick(row)}/>
                  <ImageIcon onClick={() => handleImageButtonClick(row)}/>
                  <BasketIcon onClick={() => handleDeleteButtonClick(row.id)}/>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <ModalWindow handleBackdropClick={() => {setIsAddModalWindowOpened(false); setIsEditModalWindowOpened(false); productTitleValue && setProductTitleValue(''); productInfoValue && setProductInfoValue('')}}
        className={styles.modal} active={isAddModalWindowOpened || isEditModalWindowOpened}>
          <h3 style={{color: '#f6881b'}}className={styles.modal__title}>Заполните данные</h3>
          <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleProductFormSubmit(event)}
          className={styles['form']}>
            {/* <Dropdown className={styles['dropdown']} onSelect={handleCategorySelect}>
              <Dropdown.Toggle
                  className={styles['dropdown__toggle']}
                  style={{
                      borderColor: '#2787F5',
                      backgroundColor: "#fff",
                      color: '#000',
                  }}
              >   
                {categoryValue?.title}
                <ArrowDownIcon className={styles.dropdown__icon}/>
              </Dropdown.Toggle>
              <Dropdown.Menu className={styles['dropdown__menu']}>
                {categories
                  .map(category => (
                    category.title !== 'Все категории' && <Dropdown.Item className={styles['dropdown__menu-item']} key={category.id} eventKey={category.id}>
                      {category.title}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
             </Dropdown> */}
            <div className={styles.form__item}>
              <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => {setProductTitleValue(event.target.value)}} value={productTitleValue} className={styles.form__input} type="text" placeholder="Название категории*" />
            </div>
            <div className={styles.form__item}>
              <Form.Control
                as="textarea"
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setProductInfoValue(event.target.value)}
                value={productInfoValue}
                className={styles.form__textarea}
                placeholder="Описание*"
                style={{borderColor: '#f6881b'}}
              />
            </div>
            <Button style={{backgroundColor: '#f6881b'}} type='submit'>Сохранить</Button>
          </Form>
        </ModalWindow>

        <ModalWindow handleBackdropClick={() => setIsDeleteModalWindowOpened(false)} active={isDeleteModalWindowOpened} className={styles.modal}>
          <h3 className={styles.modal__title}>Вы уверены, что хотите удалить?</h3>
          <div className={styles['modal__delete-btns']}>
            <Button onClick={() => {deleteProduct()}} className={styles.modal__btn}>Подтвердить</Button>
            <Button onClick={() => setIsDeleteModalWindowOpened(false)} className={styles.modal__btn}>Закрыть</Button>
          </div>
        </ModalWindow>

        {/* <ModalWindow handleBackdropClick={() => setIsDeleteModalWindowOpened(false)} active={isDeleteModalWindowOpened} className={styles.modal}>
          <h3 className={styles.modal__title}>Вы уверены, что хотите удалить данную комнату?</h3>
          <div className={styles['modal__delete-btns']}>
            <Button onClick={() => {deleteSubscription()}} className={styles.modal__btn}>Подтвердить</Button>
            <Button onClick={() => setIsDeleteModalWindowOpened(false)} className={styles.modal__btn}>Закрыть</Button>
          </div>
        </ModalWindow> */}

        <ModalWindow handleBackdropClick={() => {setIsImageModalWindowOpened(false); setSelectedImage(null)}} active={isImageModalWindowOpened } className={styles.modal}>
          <h3 style={{color: '#f6881b'}} className={styles.modal__title}>Выберите картинку</h3>
          {currentImage && <h4 style={{color: '#f6881b'}} className={styles.modal__subtitle}>Текущее изображение</h4>}
          <div className={styles.dropzone__container}>
          <div className="dropzone__wrapper">
          <img className={styles.dropzone__image} src={currentImage} alt="" />
          {selectedImage && <p className={styles.dropzone__filename}>Вы загрузили: <b>{selectedImage.name}</b></p>}
            <label className={styles.dropzone__btn} htmlFor="upload">
              <span className={styles['dropzone__btn-text']}>Загрузите изображение</span>
            </label>
            <input className={styles.dropzone__input} id="upload" type="file" onChange={handleImageChange} />
          </div>
          </div>
          <Button style={{backgroundColor: '#f6881b'}} disabled={selectedImage ? false : true} className={styles.dropzone__button} onClick={handleUpload}>Сохранить</Button>
          
        </ModalWindow>
      </div>
    </>
  );
}

export default CustomTable