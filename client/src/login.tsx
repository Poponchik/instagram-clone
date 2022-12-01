import styles from './styles/login.module.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import dataService from './ds'
import * as React from 'react'

type Errors = {
    email: '',
    password: ''
}

function Login() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

   
    let [errors, setErrors] = useState<Errors | {}>({})

    function validation() {
        errors = {}

        if (!email) {
            errors[email] = 'Field is empty!'
        }
        if (!password) {
            errors[password] = 'Field is empty!'
        }

        setErrors(errors)
    }

    async function login() {
        validation()
        if(!email || !password) return
        try{
            const {data} = await dataService.auth.login(email, password)

            if (data.message) return alert(data.message) 
            setPassword('')
            setEmail('')

            localStorage.setItem('userData', JSON.stringify({ accessToken: data.accessToken}))
            window.location.href = "/"

        } catch(e) {
            alert(e)
        }
        
    }

    return (
        <div className={styles.container}>
            <div className={styles.inner_container}>
                <div className={styles.form}>
                    <div className={styles.photo}>
                        <img className={styles.logo} src="../images/IG logo.png" />
                    </div>
                    <div className={styles.inputs}>
                        <input className={styles.input} placeholder="Email"
                        onChange={(event) => setEmail(event.target.value)}
                        ></input>
                    </div>
                    <div className={styles.inputs}>
                        <input type="password" className={styles.input} placeholder="Password"
                        onChange={(event) => setPassword(event.target.value)}
                        ></input>
                    </div>
                    <button className={styles.btn_logIn} onClick = {login}>Log in</button>
                    <div className={styles.link_no_account}>
                        <p className={styles.no_account}>Don’t have an account?</p>
                        <Link to='/auth/registration' className={styles.link_sign_up}>Sign up</Link>
                        
                    </div>
                </div>
            </div >
        </div >
    );
}

export default Login;
