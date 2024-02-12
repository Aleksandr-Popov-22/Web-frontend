/*
import React from 'react'
import { Link } from 'react-router-dom'
import styles from './BreadCrumbs.module.scss'
//import ArrowIcon from 'components/Icons/ArrowIcon'



export type BreadCrumbsProps = {
  links: Map<string, string>;
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({links}) => {
  return (
    <div className={styles.breadcrumbs}>
    {Array.from(links.entries()).map(([key, value], index) => (
      <span
          key={key}
          className={`${styles.breadcrumbs__item} ${index === links.size - 1 ? styles['breadcrumbs__item-last'] : ''}`}
        >
        <Link className={`${styles['breadcrumbs__item-link']} ${index === links.size - 1 ? styles['breadcrumbs__item-last'] : ''}`} to={value}>
          {key}
        </Link>
        {index !== links.size - 1 && 
        <span className={styles['breadcrumbs__item-icon']}></span>}
      </span>
    ))}
  </div>
  )
}

export default  BreadCrumbs*/



import "./BreadCrumbs.css";
import React from "react";
import { Link } from "react-router-dom";
import { FC } from "react";
//import { ROUTES } from "../../App/Routes";

interface ICrumb {
  label: string;
  path?: string;
}

interface BreadCrumbsProps {
  crumbs: ICrumb[];
}

export const BreadCrumbs: FC<BreadCrumbsProps> = (props) => {
  const { crumbs } = props;

  return (
    <ul className="breadcrumbs">
      {crumbs.map((crumb, index) => (
          <React.Fragment key={index}>
              <li>
                <Link to={crumb.path || ""}>{crumb.label}</Link>
              </li>
    <li className="slash">/</li>

          </React.Fragment>
        ))}
        
    </ul>
  );
};

export default  BreadCrumbs