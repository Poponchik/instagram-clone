import styles from "./styles/main.module.css";
import * as React from "react";
import { useEffect, useState } from "react";
import { config } from "./config";
import Loading from "./loading";
import { AiOutlineHeart } from "react-icons/ai";
import { AiOutlineMessage } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import dataService from "./ds";
import { User, Post, Comment } from "./types";
import { getUser } from "./utils";

function Main() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [recommendations, setRecommendations] = useState<User[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  function buttonSubscibe(account: User) {
    if (account.subscription) {
      return (
        <button
          className={styles.btn_subscribe}
          onClick={() => toggleSubscription(account._id)}
        >
          Unsubscribe
        </button>
      );
    }

    return (
      <button
        className={styles.btn_subscribe}
        onClick={() => toggleSubscription(account._id)}
      >
        Subscribe
      </button>
    );
  }

  function likeCommentExists(comment: Comment, post: Post) {
    if (comment.like) {
      return (
        <AiFillHeart
          className={styles.iconFillHeart}
          size={14}
          onClick={() => {
            likeComment(comment._id, post._id);
            comment.countLiked--;
          }}
        />
      );
    }
    return (
      <AiOutlineHeart
        className={styles.iconHeart}
        size={14}
        onClick={() => {
          likeComment(comment._id, post._id);
          comment.countLiked++;
        }}
      />
    );
  }

  function saveExists(post: Post) {
    if (post.saved) {
      return (
        <FaBookmark
          className={styles.iconFillBookmark}
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

  async function getFeed() {
    const { data } = await dataService.post.getFeed();
    setPosts(data);
    setLoading(false);
  }

  function likeExists(post) {
    if (post.like) {
      return (
        <AiFillHeart
          className={styles.iconFillHeart}
          size={27}
          onClick={() => {
            like(post._id);
            post.countLiked--;
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
          post.countLiked++;
        }}
      />
    );
  }

  async function toggleSubscription(id: string) {
    const response = await dataService.user.toggleSubscribtion(id);

    if (response.status === 200) {
      const subscribedUserIndex = recommendations.findIndex(
        (user) => user._id === id
      );
      recommendations[subscribedUserIndex].subscription =
        !recommendations[subscribedUserIndex].subscription;
      setRecommendations([...recommendations]);
    }
  }

  function buttonDelete(comment: Comment, post: Post) {
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

  async function likeComment(commentId: string, postId: string) {
    const response = await dataService.post.likeComment(commentId);

    if (response.status === 200) {
      const likedPostCommentIndex = posts.findIndex(
        (post) => post._id === postId
      );
      const commentIndex = posts[likedPostCommentIndex].comments.findIndex(
        (comment) => comment._id === commentId
      );
      posts[likedPostCommentIndex].comments[commentIndex].like =
        !posts[likedPostCommentIndex].comments[commentIndex].like;
      setPosts([...posts]);
    }
  }

  async function getRecommendation() {
    const { data } = await dataService.post.getRecommendation();
    setRecommendations(data);
  }

  async function sendComment(id: string) {
    const response = await dataService.post.sendComment(commentText, id);

    if (response.status === 200) {
      const commentedPostIndex = posts.findIndex((post) => post._id === id);
      posts[commentedPostIndex].comments.push(response.data);
      setPosts([...posts]);
      setCommentText("");
    }
  }

  async function deleteComment(id: string) {
    if (!id) return alert(404);
    const response = await dataService.post.deleteComment(id);
    if (response.status === 200) {
      posts.forEach((post) => {
        post.comments = post.comments.filter((comment) => comment._id !== id);
      });

      setPosts([...posts]);
    }
  }

  async function like(id: string) {
    const response = await dataService.post.likePost(id);

    if (response.status === 200) {
      const likedPostIndex = posts.findIndex((post) => post._id === id);
      posts[likedPostIndex].like = !posts[likedPostIndex].like;
      setPosts([...posts]);
    }
  }

  async function save(id: string) {
    const response = await dataService.post.save(id);

    if (response.status === 200) {
      const savedPostIndex = posts.findIndex((post) => post._id === id);
      posts[savedPostIndex].saved = !posts[savedPostIndex].saved;
      setPosts([...posts]);
    }
  }

  useEffect(() => {
    getFeed();
    getRecommendation();
  }, []);

  return (
    <React.Fragment>
      {loading && <Loading />}
      <main className={styles.content_header}>
        <div className={styles.inner_main}>
          <div className={styles.main}>
            <div className={styles.posts}>
              {posts.length == 0 ? (
                <h3 className={styles.text_recomendarions}>
                  Subscribe to read your friends' posts
                </h3>
              ) : null}
              {posts.map((post) => {
                return (
                  <div className={styles.post} key={post._id}>
                    <Link
                      to={"/" + (post.user as User).username}
                      className={styles.link}
                    >
                      <div className={styles.username_block}>
                        <img
                          className={styles.main_image}
                          src={`${config.serverUrl}/${
                            (post.user as User).photo
                          }`}
                        ></img>
                        <p className={styles.username}>
                          {(post.user as User).username}
                        </p>
                      </div>
                    </Link>

                    <div>
                      <img
                        src={`${config.serverUrl}/${post.photo}`}
                        className={styles.photo}
                      ></img>
                    </div>
                    <div className={styles.icons}>
                      <div className={styles.icons_left}>
                        {likeExists(post)}
                        <Link to={"/p/" + post._id} className={styles.link}>
                          <AiOutlineMessage className={styles.icon} size={26} />
                        </Link>
                      </div>
                      {saveExists(post)}
                    </div>

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

                    <div className={styles.description_block}>
                      <p className={styles.username_description}>
                        {(post.user as User).username}
                      </p>
                      <p className={styles.description}>{post.description}</p>
                    </div>

                    <div className={styles.comments_block}>
                      {post.comments.map((comment) => {
                        return (
                          <div className={styles.div_comment}>
                            <div key={comment._id} className={styles.comment}>
                              <Link
                                to={"/" + (comment.user as User).username}
                                className={styles.link}
                              >
                                <p className={styles.comment_username}>
                                  {(comment.user as User).username}
                                </p>
                              </Link>
                              <p className={styles.comment_text}>
                                {comment.text}
                              </p>
                            </div>
                            <div className={styles.comment_icons}>
                              {likeCommentExists(comment, post)}
                              {buttonDelete(comment, post)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.date}>AUGUST 6</div>
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
                );
              })}
            </div>

            <div className={styles.recommend}>
              <div className={styles.recomend_acc}>
                {recommendations.length == 0 ? (
                  <h3 className={styles.text_recomendarions}>
                    You already subscribed to all
                  </h3>
                ) : (
                  <h3 className={styles.text_recomendarions}>
                    Recomendations for you
                  </h3>
                )}
                <div className={styles.accounts_block}>
                  {recommendations.map((account) => (
                    <div key={account._id} className={styles.account}>
                      <Link to={"/" + account.username} className={styles.link}>
                        <div className={styles.acc_block}>
                          <img
                            src={`${config.serverUrl}/${account.photo}`}
                            className={styles.recommend_photo}
                          ></img>
                          <div className={styles.recommend_info}>
                            <p className={styles.username_rec}>
                              {account.username}
                            </p>
                            <p className={styles.name_rec}>{account.name}</p>
                          </div>
                        </div>
                      </Link>
                      {buttonSubscibe(account)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}

export default Main;
