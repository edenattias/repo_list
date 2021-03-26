import React, {useState} from 'react';
import BlockUi from 'react-block-ui';
import styles from './App.module.scss';
import SiteLayout from "../Layout/SiteLayout";
import RepositoriesTable from "../RepositoriesTable/RepositoriesTable";
import {LoadingProvider} from '../../react-contexts/LoadingContext';


const App = () => {

    const [loading, setLoading] = useState(false);

    return (
        <LoadingProvider value={{loading, setLoading}}>
            <BlockUi className={styles.blockUi} blocking={loading} renderChildren={true}>
                <SiteLayout>
                    <RepositoriesTable/>
                </SiteLayout>
            </BlockUi>
        </LoadingProvider>
    )

}

export default App