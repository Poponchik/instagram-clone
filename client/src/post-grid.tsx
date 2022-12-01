import styles from './styles/post-grid.module.css'
import { useState } from 'react';
import { config } from './config';
import { Link } from "react-router-dom"
import * as React from 'react'


function PostsGrid({ posts }) {
    const [showPost, setShowPost] = useState(false)
    const [photo, setPhoto] = useState('')
    const [description, setDescription] = useState('')
    const [post, setPost] = useState('')

    return (
        <>
            <div className={styles.posts}>
                <div className={styles.posts}>
                    {posts.map(photo => (
                        <Link key={photo._id} to={"/p/" + photo._id} className={styles.link}>
                            <div key={photo._id} className={styles.one_post}>
                                <img key={photo._id} className={styles.photo} src={`${config.serverUrl}/${photo.photo}`}
                                    onClick={() => {
                                        setShowPost(true)
                                        setPhoto(`${config.serverUrl}/${photo.photo}`)
                                        setDescription(photo.description)
                                        setPost(photo)
                                    }} />
                            </div>
                        </Link>
                    ))}</div>
            </div>
        </>

    );
}

export default PostsGrid;
