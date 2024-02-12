import React from 'react';
import { Link } from 'react-router-dom'
import styles from './Header.module.scss'

const Header: React.FC = () => {
    return (
        <div className={styles.header}>
            <div className={styles.header__wrapper}>
                <Link to='/' className={styles.header__logo}>NewMarket</Link>

            </div>
        </div>
    )
};

export default Header;