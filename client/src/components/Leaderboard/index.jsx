import React from 'react';
import styles from './leaderboard.module.css';

const index = ({ data }) => {
    return (
        <div className={styles.leaderboard}>
            <div className={`${styles.row} ${styles.header}`}>
                <div className={styles.rank}>Rank</div>
                <div className={styles.username}>Username</div>
                <div className={styles.points}>Points</div>
            </div>
            {data.map((item, index) => (
                <div
                    key={index}
                    className={`${styles.row} ${
                        index % 2 === 0 ? styles.evenRow : styles.oddRow
                    }`}
                >
                    <div className={styles.rank}>{item.rank}</div>
                    <div className={styles.username}>{item.username}</div>
                    <div className={styles.points}>{item.points}</div>
                </div>
            ))}
        </div>
    );
};

export default index;