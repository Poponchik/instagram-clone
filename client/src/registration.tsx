import styles from './styles/registration.module.css'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import dataService from './ds'
import * as React from 'react'

type Error = {
    email: '',
        password: ''
}


function Registration() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [errors, setErrors] = useState<Error | {}>({})

    function validation() {
        const errors = {}

        if (!email) {
            errors["email"] = 'Field is empty!'
        }
        if (!password) {
            errors["password"] = 'Field is empty!'
        }
        if (!username) {
            errors["username"] = 'Field is empty!'
        }
        if (!name) {
            errors["name"] = 'Field is empty!'
        }

        setErrors(errors)
    }

    async function registration(){
        validation()
        if(!email || !password) return
        try{
           await dataService.auth.registration(email, password, username, name)

            setEmail('')
            setName('')
            setUsername('')
            setPassword('')

            window.location.href = "/auth/login";

        } catch (e){
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
                        <input className={styles.input} placeholder="First name"
                        onChange={(event) => setName(event.target.value)}
                        ></input>
                    </div>
                    <div className={styles.inputs}>
                        <input className={styles.input} placeholder="Username"
                        onChange={(event) => setUsername(event.target.value)}
                        ></input>
                    </div>
                    <div className={styles.inputs}>
                        <input type="password" className={styles.input} placeholder="Password"
                        onChange={(event) => setPassword(event.target.value)}
                        ></input>
                    </div>
                    <button className={styles.btn_signIn}
                    onClick={registration}
                    >Sign up</button>
                    <div className={styles.link_no_account}>
                        <p className={styles.no_account}>Have an account?</p>
                        <Link to='/auth/login' className={styles.link_sign_up}>Log in</Link>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default Registration;
