import styles from "./styles/account.module.css";
import { useParams } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa";
import { AiOutlineTable } from "react-icons/ai";
import { useEffect, useState } from "react";
import { config } from "./config";
import PostsGrid from "./post-grid";
import EditUser from "./edit-user";
import dataService from "./ds";
import Loading from "./loading";
import { User, Post } from "./types";
import * as React from "react";
import { getUser } from "./utils";

const tabs = {
  accountPosts: "accountPosts",
  savedPosts: "savedPosts",
};

function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<any>({user: true, posts: true})
  const [postsLength, setPostsLength] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [tab, setTab] = useState<string>(tabs.accountPosts);

  let { username } = useParams();

  function subscribeOrEditButton(): JSX.Element {
    const authUsername = getUser()?.username;
    if (username === authUsername) {
      return (
        <>
          <button className={styles.edit_button} onClick={() => setEdit(true)}>
            Edit profile
          </button>
        </>
      );
    }

    if (user?.subscription) {
      return (
        <div className={styles.unsubscribe_block}>
          <button
            className={styles.unsubscibe_button}
            onClick={toggleSubscription}
          >
            Unsubscribe
          </button>
        
        </div>
      );
    }

    return (
      <button className={styles.subscibe_button} onClick={toggleSubscription}>
        Subscribe
      </button>
    );
  }

  function mainPhoto(): JSX.Element {
    const authUsername = getUser()?.username;
    if (username !== authUsername) {
      return (
        <img
          className={styles.main_image}
          src={`${config.serverUrl}/${user?.photo}`}
        />
      );
    }

    return (
      <img
        className={styles.main_image}
        src={`${config.serverUrl}/${user?.photo}`}
        onClick={() => setShow(true)}
      />
    );
  }

  async function toggleSubscription() {
    await dataService.user.toggleSubscribtion(user?._id!);
    if (!username) return;
    getInfo(username);
  }

  async function getInfo(username: string) {
    const data = await dataService.user.getInfo(username);
    setUser(data);
    setLoading({...loading, user: false})
  }

  async function getSavedPosts() {
    const {data}  = await dataService.post.getSavedPosts();
    setPosts(data);
  }

  async function getPosts(userId: string) {
    const data = await dataService.post.getPosts(userId);
    setPosts(data.posts);
    setPostsLength(data.postsCount);
      setLoading({...loading, posts: false})
  }

  useEffect(() => {
    if (username) {
      getInfo(username);
    }
  }, [username]);

  useEffect(() => {
    if (!user || !user._id) return;

    if (tab === tabs.accountPosts) {
      getPosts(user._id);
    }
    if (tab === tabs.savedPosts) {
      getSavedPosts();
    }
  }, [user, tab]);

  if(loading.user || loading.posts) return <Loading/>

  return (
    <main className={styles.main}>
      <div className={styles.inner_main}>

        <div className={styles.main_info}>
          {mainPhoto()}

          <div className={styles.info}>
            <EditUser
              edit={edit}
              setEdit={setEdit}
              defaultUsername={user.username}
              defaultName={user.name}
              defaultDescription={user.description}
            />

            <div className={styles.title}>
              <h1 className={styles.name}>{user.username}</h1>
              {subscribeOrEditButton()}
            </div>

            <div className={styles.info_block}>
              <div className={styles.info_account}>
                <div className={styles.amount}>{postsLength}</div>
                <p className={styles.account_info}>posts</p>
              </div>
              <div className={styles.info_account}>
                <div className={styles.amount}>{user.countSubscribed}</div>
                <p className={styles.account_info}>subscribers</p>
              </div>
              <div className={styles.info_account}>
                <div className={styles.amount}>{user.countSubscribers}</div>
                <p className={styles.account_info}>subscriptions</p>
              </div>
            </div>

            <div className={styles.description_block}>
              <h3 className={styles.account_name}>{user.name}</h3>
              <p className={styles.description}>{user.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.posts_block}>
        <hr className={styles.line} />

        <div className={styles.title_posts}>
          <div
            className={
              tab === tabs.savedPosts
                ? styles.save_block_nactive
                : styles.save_block_active
            }
            onClick={() => setTab(tabs.accountPosts)}
          >
            <AiOutlineTable size={20} />
            <p>POSTS</p>
          </div>

          {getUser()?.username === username && (
            <div
              className={
                tab === tabs.accountPosts
                  ? styles.save_block_nactive
                  : styles.save_block_active
              }
              onClick={() => setTab(tabs.savedPosts)}
            >
              <FaRegBookmark size={18} />
              <p>SAVED</p>
            </div>
          )}
        </div>
      </div>
      {posts.length !== 0 ? (
        <PostsGrid posts={posts} />
      ) : (
        <div className={styles.noPosts_div}>
          <p className={styles.noPosts}>There is no posts yet :( </p>
        </div>
      )}
    </main>
  );
}

export default Account;
