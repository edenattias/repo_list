import React from 'react';
import {Avatar} from 'antd';
import styles from './AuthorCell.module.scss'

interface IProps {
    imagePath: string
    authorName: string
}

const AuthorCell = (props: IProps) => {
    const {imagePath, authorName} = props
    return (
        <div className={styles.container}>
            <Avatar size={35} src={imagePath}/>
            <span className={styles.caption}>{authorName}</span>
        </div>
    );
};

export default AuthorCell;