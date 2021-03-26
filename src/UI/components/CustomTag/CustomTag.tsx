import React from 'react';
import {Tag} from 'antd';
import {Status} from "../../../common/consts/enums";

interface IProps {
    tagType: string
    color?: string
}

const CustomTag = (props: IProps) => {

    const {tagType, color} = props

    const colors = {
        [Status.open]: 'green',
        [Status.closed]: 'volcano',
        [Status.draft]: 'geekblue'
    }

    return (
        <Tag color={color ? color : colors[tagType]} key={tagType}>
            {tagType.toUpperCase()}
        </Tag>
    );
};

export default CustomTag;