import styles from './styles/loading.module.css'
import Loading from 'react-loading-components'
import * as React from 'react'

function LoadingComponent(): JSX.Element {
    return (
        <div className={styles.modal_window}>
            <Loading type='tail_spin' width={100} height={100} fill='#739AFF' className={styles.modal_content} />
        </div>
    );
}

export default LoadingComponent;
