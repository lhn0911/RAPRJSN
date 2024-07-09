import React, { useState, useEffect } from "react";
import MainLeft from "./main/Mainleft";
import MainRight from "./main/Mainright";
import StoriesSection from "./post/StoriesSection";
import Post from "./post/Post";
import CreatePostModal from "./post/CreatePostModaal";
import baseUrl from "../../../api/index";
import "./Home.scss";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          postsResponse,
          storiesResponse,
          groupsResponse,
          commentsResponse,
        ] = await Promise.all([
          baseUrl.get("/Post"),
          baseUrl.get("/stories"),
          baseUrl.get("/groups"),
          baseUrl.get("/comments"),
        ]);
        setPosts(postsResponse.data);
        setStories(storiesResponse.data);
        setGroups(groupsResponse.data);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      baseUrl.get("/User").then((response) => {
        const user = response.data.find(
          (user: any) => user.name === storedUserName
        );
        if (user) {
          setCurrentUser(user);
        }
      });
    }

    const handleLogin = (event: CustomEvent) => {
      const { userName } = event.detail;
      baseUrl.get("/User").then((response) => {
        const user = response.data.find((user: any) => user.name === userName);
        if (user) {
          setCurrentUser(user);
          localStorage.setItem("userName", userName);
        }
      });
    };

    const handleLogout = () => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userName");
      setCurrentUser(null);
    };

    window.addEventListener("userLoggedIn", handleLogin as EventListener);
    window.addEventListener("userLoggedOut", handleLogout as EventListener);

    return () => {
      window.removeEventListener("userLoggedIn", handleLogin as EventListener);
      window.removeEventListener(
        "userLoggedOut",
        handleLogout as EventListener
      );
    };
  }, []);

  const handlePost = async (newPost: any) => {
    if (newPost.content.trim() === "") return;

    const post = {
      id: posts.length + 1,
      user: currentUser.name,
      userImg: currentUser.avatar,
      content: newPost.content,
      visibility: newPost.visibility,
      image: newPost.image ? URL.createObjectURL(newPost.image) : null,
      like: 0,
      comment: 0,
      share: 0,
    };

    try {
      await baseUrl.post("/Post", post);
      setPosts([post, ...posts]);
    } catch (error) {
      console.error("Lỗi khi đăng bài", error);
    }
  };

  const handleEditPost = (post: any) => {
    console.log("Chỉnh sửa bài viết", post);
  };

  const handleDeletePost = async (postId: any) => {
    try {
      await baseUrl.delete(`/Post/${postId}`);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Lỗi khi xóa bài viết", error);
    }
  };

  return (
    <div className="main-container">
      <MainLeft groups={groups} friends={friends} />
      <div className="main-content">
        <div>
          <StoriesSection stories={stories} />
        </div>
        <div className="create-post">
          <div className="create-post-header d-flex flex-column">
            <div>
              {currentUser && (
                <img
                  src={currentUser.img}
                  alt="profile"
                  className="profile-img"
                />
              )}
              <input
                type="text"
                placeholder={`${
                  currentUser ? currentUser.name : "Hoàng"
                } ơi, bạn đang nghĩ gì thế?`}
                onClick={() => setModalShow(true)}
              />
            </div>
            <div className="d-flex mt-3 gap-5">
              <div className="d-flex">
                <span className="material-symbols-outlined">videocam</span>Video
                trực tiếp
              </div>
              <div className="d-flex">
                <span className="material-symbols-outlined">photo_library</span>
                Ảnh/Video
              </div>
              <div className="d-flex">
                <span className="material-symbols-outlined">mood</span>Biểu
                tượng cảm xúc
              </div>
            </div>
          </div>
        </div>
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            comments={comments}
            currentUser={currentUser}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        ))}
      </div>
      <MainRight currentUser={currentUser} groups={groups} />
      <CreatePostModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        currentUser={currentUser}
        onPost={handlePost}
      />
    </div>
  );
}
