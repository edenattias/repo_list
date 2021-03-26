import React from 'react';
import {Layout} from 'antd';
import styles from './Layout.module.scss'

const {Content} = Layout;


const SiteLayout = ({children}) => {
    return (
        <Layout className={styles.container}>
            <Layout className="site-layout" >
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default SiteLayout;