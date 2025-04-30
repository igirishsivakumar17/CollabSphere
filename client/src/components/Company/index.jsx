import React from 'react';
import styles from './company.module.css';

const index = ({ name }) => {
    return (
        <div className={styles.companyBox}>
            {name}
        </div>
    );
};

export default index;