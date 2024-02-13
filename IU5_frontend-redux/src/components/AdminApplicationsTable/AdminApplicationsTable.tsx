import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './AdminApplicationsTable.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ModalWindow from 'components/ModalWindow'
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { useCurrentApplicationDate, useProductsFromApplication,
  setCurrentApplicationDateAction, setProductsFromApplicationAction, setCurrentApplicationIdAction, useApplications, setApplicationsAction } from 'Slices/ApplicationsSlice'
import { Link } from 'react-router-dom';
import CancelIcon from 'components/Icons/CancelIcon';
import AcceptIcon from 'components/Icons/AcceptIcon';



interface ApplicationData {
  id: number;
  status: string;
  creationDate: string;
  publicationDate: string;
  approvingDate: string;
  readyStatus: boolean;
}

interface ProductData {
  id: number;
  title: string;
  info: string;
  src: string;
}

export type ReceivedProductData = {
  id: number,
  name_category: string,
  info: string,
  status: string,
  image: string,
}

export type ProductsTableProps = {
  className?: string;
};

export type ReceivedApplicationData = {
  id: number;
  status: string;
  date_creation: string;
  date_formation: string;
  date_completion: string;
  status_priority: boolean;
}

const AdminApplicationsTable: React.FC<ProductsTableProps> = ({className}) => {
  const dispatch = useDispatch();
  const applications = useApplications()
  const [isModalWindowOpened, setIsModalWindowOpened] = useState(false);
  const [currentProducts, setCurrentProducts] = useState<ProductData[]>([])

  const getAllApplications = async () => {
    try {
      const response = await axios('http://localhost:8000/requests/', {
        method: 'GET',
        withCredentials: true
      })
      const newArr = response.data.map((raw: ReceivedApplicationData) => ({
        id: raw.id,
        status: raw.status,
        // status: raw.status=="moderating" ? "Проверяется":"",
        // status: raw.status=="moderating" ? "Проверяется" : raw.status=="approved" ? "Принято" : raw.status=="registered" ? "Зарегистрирован" : raw.status=="denied" ? "Отказано" : raw.status=="deleted" ? "Удалено" : "",
        creationDate: raw.date_creation,
        publicationDate: raw.date_formation,
        approvingDate: raw.date_completion,
        readyStatus: raw.status_priority
    }));
    dispatch(setApplicationsAction(newArr))
    } catch(error) {
      throw error
    }
  }

  const getCurrentApplication = async (id: number) => {
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
    setCurrentProducts(newArr)
    console.log('newArr is', newArr)
    } catch(error) {
      console.log("AAT")
      throw error;
    }
  }

  const putApplication = async (id: number, isAccepted: boolean) => {
    try {
      if (isAccepted) {
        await axios(`http://localhost:8000/requests/${id}/put_status_admin`, {
          method: 'PUT',
          data: {
            status: "Завершена"
          },
          withCredentials: true
        })
        toast.success('Заявка успешно завершена!')
      } else {
        await axios(`http://localhost:8000/requests/${id}/put_status_admin`, {
          method: 'PUT',
          data: {
            status: "Отклонена"
          },
          withCredentials: true
        })
        toast.success('Заявка успешно отклонена!')
      }

      const updatedApplications = applications.map(application => {
        if (application.id === id) {
          return {
            ...application,
            status: isAccepted ? 'Завершена' : 'Отклонена'
          };
        }
        return application;
      });

      dispatch(setApplicationsAction(updatedApplications))
    } catch(e) {
      throw e
    }
  }
  

  const handleDetailedButtonClick = (id: number) => {
    getCurrentApplication(id)
    setIsModalWindowOpened(true)
  };

  const handleAcceptButtonClick = (id: number) => {
    putApplication(id, true)
  }

  const handleCancelButtonClick = (id: number) => {
    putApplication(id, false)
  }

  React.useEffect(() => {
    getAllApplications()
  }, [])

  return (
    <>
    <div className={styles.table__container}>
    <Table responsive borderless className={!className ? styles.table : cn(styles.table, className)}>
        <thead>
          <tr className={styles.tableHead}>
            <th>№</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Дата формирования</th>
            <th>Дата завершения</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application: ApplicationData, index: number) => (
            
            <tr key={application.id}>
              {application.status !== 'Черновик' && <>
              <td>{++index}</td>
              <td>{application.status}</td>
              <td>{application.creationDate}</td>
              <td>{application.publicationDate ? application.publicationDate : '-'}</td>
              <td>{application.approvingDate ? application.approvingDate : '-'}</td>
              <td className={styles.table__action}>
                {/* <Link to={`/applications/${application.id}`}>
                <Button>Подробнее</Button>
                </Link> */}
                {/* <Link to={`/applications/${application.id}`}> */}
                  <Button style={{backgroundColor: '#f6881b'}} onClick={() => handleDetailedButtonClick(application.id)}>Подробнее</Button>
                  {application.status === 'Сформирована' && <><CancelIcon onClick={() => handleCancelButtonClick(application.id)}></CancelIcon>
                  <AcceptIcon onClick={() => handleAcceptButtonClick(application.id)}></AcceptIcon></>}
                {/* </Link> */}
              </td>
              </>}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

      <ModalWindow handleBackdropClick={() => setIsModalWindowOpened(false)} className={styles.modal} active={isModalWindowOpened}>
      <h3 className={styles.modal__title}>Добавленные категории</h3>
      <div className={styles.modal__list}>
        {currentProducts.map((categorys: ProductData, index: number) => (
          <div className={styles['modal__list-item']}>
            <div className={styles['modal__list-item-title']}>
              {categorys.title} "{categorys.title}"
            </div>
          </div>
        ))}
      </div>
      </ModalWindow>
    </>
  );
}

export default AdminApplicationsTable