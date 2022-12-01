import styles from "./styles/header.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { GrHomeRounded } from "react-icons/gr";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { config } from "./config";
import UploadPhoto from "./upload-photo";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dataService from "./ds";
import * as React from "react";
import { getUser } from "./utils";
import { User } from "./types";


function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [found, setFound] = useState<User[]>([]);
  const [focus, setFocus] = useState<boolean>(false);

  async function searchUser(username: string) {
    if (!username) return;
    const data = await dataService.user.searchUser(username);
    setFound(data);
  }

  function search_result(): JSX.Element | null {
    if (!focus) {
      return null;
    }

    return (
      <div className={styles.wrapper} onClick={() => setFocus(false)}>
        <div className={styles.div_result_search}>
          {found.map((user) => (
            <Link
              key={user["_id"]}
              to={"/" + user["username"]}
              className={styles.link}
            >
              <div
                key={user["_id"]}
                className={styles.user_search}
                onClick={() => setFocus(false)}
              >
                <img
                  className={styles.user_search_photo}
                  src={`${config.serverUrl}/${user["photo"]}`}
                />
                <a className={styles.user_search_username}>
                  {user["username"]}
                </a>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  async function getInfo(username: string) {
    const data = await dataService.user.getInfo(username);
    setUser(data);
  }

  function logout() {
    localStorage.removeItem("userData");
    window.location.href = "/auth/login";
  }

  useEffect(() => {
    const username = getUser()?.username;
    if (!username) return;
    getInfo(username);
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner_container}>
        <>
          <header className={styles.header}>
            <div className={styles.content_header}>
              <UploadPhoto show={show} setShow={setShow} />

              <img className={styles.logo} src="../images/IG logo.png"></img>
              <div className={styles.input_search}>
                <AiOutlineSearch className={styles.icon_search} />
                <input
                  className={styles.input}
                  placeholder="Search.."
                  onChange={(event) => {
                    searchUser(event.target.value);
                  }}
                  onFocus={() => setFocus(true)}
                ></input>
                {search_result()}
              </div>
              <nav className={styles.icons}>
                <Link to="/">
                  <GrHomeRounded className={styles.icon} size={24} />
                </Link>

                <AiOutlinePlusSquare
                  className={styles.icon}
                  size={28}
                  onClick={() => setShow(true)}
                />

                <AiOutlineLogout
                  className={styles.icon}
                  size={28}
                  onClick={logout}
                />
                <Link to={"/" + user.username} className={styles.link}>
                  <img
                    className={styles.home_image}
                    src={config.serverUrl + "/" + user["photo"]}
                  ></img>
                </Link>
              </nav>
            </div>
          </header>
        </>
      </div>
    </div>
  );
}

export default Header;
