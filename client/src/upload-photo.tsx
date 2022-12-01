import styles from './styles/uploadPhoto.module.css'
import { useState } from 'react';
import { GrClose } from 'react-icons/gr';
import dataService from './ds'
import {getUser} from './utils'
import * as React from 'react'

type Props = {
    show: Boolean,
    setShow: (value: boolean) => void
}

function UploadPhoto({ show, setShow }: Props): JSX.Element | null {
    const [image, setImage] = useState<File | undefined>()
    const [description, setDescription] = useState<string>('')

    async function uploadHandler(image: File) {
        const data = new FormData();
        data.append('photo', image);
        data.append('description', description);
        await dataService.post.uploadPhoto(data)

        window.location.href = '/' + getUser()?.username
    }

    if (!show) {
        return null
    }

    return (
        <div className={styles.modal_window}>
            <div className={styles.modal_content}>
                <div className={styles.modal}>
                    <input className={styles.input_file} type="file" multiple accept="image/*"
                        onChange={event => setImage(event.target.files?.[0])}
                    />
                    <GrClose className={styles.icon} onClick={() => setShow(false)} />
                </div>
                <div>
                    <textarea className={styles.post_description} placeholder='Write description'
                    onChange={event => setDescription(event.target.value)}
                    ></textarea>
                    <button disabled={!image} className={styles.btn_upload_post} onClick={() => uploadHandler(image!)}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default UploadPhoto;
