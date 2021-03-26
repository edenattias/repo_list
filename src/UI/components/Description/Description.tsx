import React from 'react';
import {Avatar, Comment, Tooltip} from 'antd';

interface IProps {
    authorName: string
    date: string
    authorImage: string
    description: string
}

const Description = (props: IProps) => {

    const {authorName, date, authorImage, description} = props

    return (
        <Comment
            author={<a>{authorName}</a>}
            avatar={
                <Avatar
                    src={authorImage}
                />
            }
            content={
                <p>
                    <b>Description: </b>
                    {description}
                </p>
            }
            datetime={
                <Tooltip title={date}>
                    <span>{date}</span>
                </Tooltip>
            }
        />
    );
};

export default Description;