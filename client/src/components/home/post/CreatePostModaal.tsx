import React, { useState } from "react";
import moment from "moment"; // Import thư viện moment để xử lý thời gian
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import "../Home.scss";

const CreatePostModal = ({ show, onHide, currentUser, onPost }: any) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [postVisibility, setPostVisibility] = useState("public");
  const [postImage, setPostImage] = useState(null);

  const handleImageUpload = (event: any) => {
    setPostImage(event.target.files[0]);
  };

  const handleSubmit = () => {
    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const newPost = {
      content: newPostContent,
      visibility: postVisibility,
      image: postImage,
      time: currentTime,
    };
    onPost(newPost);
    setNewPostContent("");
    setPostVisibility("public");
    setPostImage(null);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="dark-theme"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Tạo bài viết
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="create-post-header">
          {currentUser && (
            <img
              src={currentUser.avatar}
              alt="profile"
              className="profile-img"
            />
          )}
          <div>
            <div className="user-name">{currentUser?.name}</div>
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {postVisibility === "public"
                  ? "Công khai"
                  : postVisibility === "friends"
                  ? "Bạn bè"
                  : "Chỉ mình tôi"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setPostVisibility("public")}>
                  Công khai
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPostVisibility("friends")}>
                  Bạn bè
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPostVisibility("private")}>
                  Chỉ mình tôi
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <Form.Control
          as="textarea"
          rows={3}
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder={`${currentUser?.name} ơi, bạn đang nghĩ gì thế?`}
          className="dark-input mt-3"
        />
        <Form.Control
          type="file"
          onChange={handleImageUpload}
          className="mt-3"
        />
        <div className="post-options mt-3">
          <Button variant="light">Aa</Button>
          <Button variant="light">😊</Button>
          <Button variant="light">📷</Button>
          <Button variant="light">👤</Button>
          <Button variant="light">😃</Button>
          <Button variant="light">📍</Button>
          <Button variant="light">GIF</Button>
          <Button variant="light">...</Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit} className="post-button">
          Đăng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePostModal;
