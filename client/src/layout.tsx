import * as React from 'react'
import Header from './header';
import styles from './styles/account.module.css'

type Props = {
    children: JSX.Element
} 

function Layout({ children }: Props) {
    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.inner_container}>
                    <Header/>
                    {children}

                </div>
            </div>
        </React.Fragment>
    )
}

export default Layout;
