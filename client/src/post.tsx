import styles from "./styles/post.module.css";
import { config } from "./config";
import { GrClose } from "react-icons/gr";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as React from "react";
import { Post as PostType, User, Comment } from "./types";
import { getUser } from "./utils";
import { Link } from "react-router-dom";

import dataService from "./ds";

function Post() {
  const [post, setPost] = useState<PostType | null>(null);
  const [commentText, setCommentText] = useState<string>("");
  const navigate = useNavigate();

  let { postId } = useParams();

  function buttonDelete(comment: Comment) {
    if (!post) return;
    if (
      (post.user as User)._id == getUser()?.id ||
      getUser()?.id === (comment.user as User)._id
    ) {
      return (
        <AiOutlineDelete
          className={styles.delete_comment}
          size={14}
          onClick={() => deleteComment(comment._id)}
        />
      );
    }
    return;
  }

  function likeExists(post: PostType) {
    if (post.like) {
      return (
        <AiFillHeart
          className={styles.iconFillHeart}
          size={27}
          onClick={() => {
            like(post._id);
          }}
        />
      );
    }
    return (
      <AiOutlineHeart
        className={styles.icon}
        size={27}
        onClick={() => {
          like(post._id);
        }}
      />
    );
  }

  function saveExists(post: PostType) {
    if (post.saved) {
      return (
        <FaBookmark
          className={styles.icon}
          size={24}
          onClick={() => {
            save(post._id);
          }}
        />
      );
    }
    return (
      <FaRegBookmark
        className={styles.icon}
        size={24}
        onClick={() => {
          save(post._id);
        }}
      />
    );
  }

  function likeCommentExists(comment: Comment) {
    if (comment.like) {
      return (
        <AiFillHeart
          className={styles.iconFillHeart}
          size={14}
          onClick={() => {
            likeComment(comment._id);
          }}
        />
      );
    }
    return (
      <AiOutlineHeart
        className={styles.icon}
        size={14}
        onClick={() => {
          likeComment(comment._id);
        }}
      />
    );
  }

  async function deleteComment(commentId: string) {
    if (!commentId) return alert(404);
    const response = await dataService.post.deleteComment(commentId);

    if (response.status === 200) {
      if (!post) return;
      post.comments = post.comments.filter(
        (comment) => comment._id !== commentId
      );
      setPost({ ...post });
    }
  }

  async function sendComment(postId: string) {
    const response = await dataService.post.sendComment(commentText, postId);

    if (response.status === 200) {
      if (!post) return;
      post.comments.push(response.data);
      setPost({ ...post });
      setCommentText("");
    }
  }

  async function like(postId: string) {
    const response = await dataService.post.likePost(postId);

    if (response.status === 200) {
      if (!post) return;
      post.like = !post.like;
      post.countLiked = response.data;
      setPost({ ...post });
    }
  }

  async function likeComment(commentId: string) {
    const response = await dataService.post.likeComment(commentId);

    if (response.status === 200) {
      if (!post) return;
      const commentIndex = post.comments.findIndex(
        (comment) => comment._id === commentId
      );
      post.comments[commentIndex].like = !post.comments[commentIndex].like;
      post.comments[commentIndex].countLiked = response.data;
      setPost({ ...post });
    }
  }

  async function deletePost(postId: string) {
    await dataService.post.deletePost(postId);
    setPost({ ...post });
    window.location.href = "/" + getUser()?.username;
  }

  async function save(postId: string) {
    const response = await dataService.post.save(postId);

    if (response.status === 200) {
      if (!post) return;
      post.saved = !post.saved;
      setPost({ ...post });
    }
  }

  async function getPost(postId: string) {
    const { data } = await dataService.post.getPost(postId);
    setPost(data);
  }

  useEffect(() => {
    if (!postId) return;
    getPost(postId);
    getUser();
  }, [postId]);

  if (!post) {
    return null;
  }

  return (
    <div className={styles.modal_window}>
      <div className={styles.modal_content}>
        <img
          key={post._id}
          className={styles.photo}
          src={config.serverUrl + "/" + post.photo}
        />
        <div className={styles.about}>
          <div className={styles.description_block}>
            <div className={styles.main_post_info}>
              <img
                className={styles.main_image}
                src={config.serverUrl + "/" + (post.user as User).photo}
              />

              <div className={styles.info}>
                <div className={styles.name_description}>
                  <h1 className={styles.name}>
                    {(post.user as User).username}
                  </h1>
                  <p className={styles.description}>{post.description}</p>
                </div>
              </div>
            </div>

            <GrClose onClick={() => navigate(-1)} className={styles.icon} />
          </div>
          <hr className={styles.line} />
          <>
            <div className={styles.comments_block}>
              {post.comments.map((comment) => {
                return (
                  <div className={styles.comment} key={comment._id}>
                    <div className={styles.content_comment}>
                      <Link
                        to={"/" + (comment.user as User).username}
                        className={styles.link}
                      >
                        <img
                          className={styles.comment_image}
                          src={`${config.serverUrl}/${
                            (comment.user as User).photo
                          }`}
                        />
                      </Link>
                      <div>
                        <div className={styles.div_comment}>
                          <p className={styles.sshshs}>
                            <Link
                              to={"/" + (comment.user as User).username}
                              className={styles.link}
                            >
                              <p className={styles.comment_name}>
                                {(comment.user as User).username}
                              </p>
                            </Link>
                            <p className={styles.comment_text}>
                              {comment.text}
                            </p>
                          </p>
                        </div>
                        <div className={styles.div_info_comment}>
                          {comment.countLiked > 0 && (
                            <div className={styles.div_count}>
                              <p className={styles.count}>Like:</p>
                              <p className={styles.count_like_comment}>
                                {comment.countLiked}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={styles.icons}>
                      {likeCommentExists(comment)}
                      {buttonDelete(comment)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.likes_block}>
              <hr className={styles.line} />
              <div className={styles.icons}>
                <div className={styles.icons_left}>
                  {likeExists(post)}
                  {post.countLiked === 0 ? null : post.countLiked === 1 ? (
                    <div className={styles.count_likes}>
                      <p>{post.countLiked}</p>
                      <p>like</p>
                    </div>
                  ) : (
                    <div className={styles.count_likes}>
                      <p>{post.countLiked}</p>
                      <p>likes</p>
                    </div>
                  )}
                </div>
                <div className={styles.icons_post}>
                  {saveExists(post)}
                  {(post.user as User)._id == getUser()?.id ? (
                    <AiOutlineDelete
                      size={30}
                      onClick={() => deletePost(post._id)}
                      className={styles.icon}
                    />
                  ) : null}
                </div>
              </div>

              <hr className={styles.line} />
              <div className={styles.input_comment_block}>
                <input
                  value={commentText}
                  placeholder="Add comment..."
                  className={styles.comment_input}
                  onChange={(event) => setCommentText(event.target.value)}
                />
                <button
                  className={styles.comment_button}
                  onClick={() => sendComment(post._id)}
                >
                  Publish
                </button>
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}

export default Post;
