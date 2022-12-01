import styles from './styles/edit.module.css'
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { GrClose } from 'react-icons/gr';
import dataService from './ds'
import * as React from 'react'
import { getUser } from "./utils";

type Errors = {
    name: '',
    username: ''
}

function EditUser({ edit, setEdit, defaultName, defaultUsername, defaultDescription }) {
    const [image, setImage] = useState<File | null>(null)
    const [name, setName] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [description, setDescription] = useState<string>('')

    let [errors, setErrors] = useState<Errors | {}>({})

    useEffect(() => {
        setName(defaultName)
        setUsername(defaultUsername)
        setDescription(defaultDescription)
    }, [])


    async function uploadHandler(image: File) {
        if(!validation()) return
        const data = new FormData();
        data.append('file', image);
        await dataService.user.uploadMainPhoto(data)

        window.location.href = '/' + getUser()?.username
    }

    function validation() {
        const errors = {}
        let validated = true

        if (!name) {
            errors["name"] = 'Field is empty!'
            validated = false
        }
        if (!username) {
            errors["username"] = 'Field is empty!'
            validated = false
        }

        setErrors(errors)

        return validated 
    }

    async function editProfile() {
        if (!validation()) return 

        const { data: newToken } = await dataService.user.editProfile(name, username, description)
        localStorage.setItem('userData', JSON.stringify(newToken))
        window.location.href = '/' + getUser()?.username
    }

    if (!edit) {
        return null
    }

    return (
        <div className={styles.modal_window}>
            <div className={styles.modal_content}>
                <div className={styles.modal}>
                    <div className={styles.inputs}>

                        <div className={styles.input_block}>
                            <input className={styles.change_main_photo} type="file" multiple accept="image/*" 
                            onChange={event => 
                            {if(event.target.files?.[0] != null){
                                setImage(event.target.files?.[0])}}
                            } />

                            <input className={styles.input} placeholder='Username' value={username}
                                onChange={event => setUsername(event.target.value)}
                            ></input>
                            <small className={styles.errors}>{errors["username"]}</small>
                        </div>
                        <div className={styles.input_block}>
                            <input className={styles.input} placeholder='Name' value={name}
                                onChange={event => setName(event.target.value)}
                            />
                            <small className={styles.errors}>{errors["name"]}</small>
                        </div>
                        <textarea className={classNames(styles.input, styles.input_description)} placeholder='Description' value={description}
                            onChange={event => setDescription(event.target.value)}
                        />
                    </div>
                    <div className={styles.icon_block}>
                        <GrClose className={styles.icon} onClick={() => setEdit(false)} />
                    </div>
                </div>
                <button className={styles.btn_upload_post} onClick={() => {
                    editProfile()
                    uploadHandler(image!)
                }
                }>Send</button>
            </div>


        </div>
    );
}

export default EditUser;
