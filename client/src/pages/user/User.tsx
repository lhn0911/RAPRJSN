import React, { useState, useEffect } from "react";
import baseURL from "../../../../../PTITSN/client/src/api/index";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function User() {
  const [userData, setUserData] = useState(null);
  const [friendsData, setFriendsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    img: "",
    introduction: "",
  });
  const [friendRequests, setFriendRequests] = useState({});
  const [status, setStatus] = useState("");
  const [editIntro, setEditIntro] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await baseURL.get("/User");
        const loggedInUser = response.data.find((user) => user.status === true);
        setUserData(loggedInUser);
        setFriendsData(
          response.data.filter((user) => user.id !== loggedInUser.id)
        );
        setFormData(loggedInUser);

        const requests = {};
        loggedInUser.addfriend?.forEach((friend) => {
          requests[friend.id] = true;
        });
        setFriendRequests(requests);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await baseURL.put(`/User/${userData.id}`, formData);
      setUserData(formData);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleAddFriend = async (friend) => {
    if (!friendRequests[friend.id]) {
      try {
        const updatedFriend = {
          ...friend,
          addfriend: [
            ...(friend.addfriend || []),
            { id: userData.id, name: userData.name, status: false },
          ],
        };
        await baseURL.put(`/User/${friend.id}`, updatedFriend);

        setFriendRequests((prev) => ({
          ...prev,
          [friend.id]: true,
        }));
      } catch (error) {
        console.error("Error sending friend request:", error);
      }
    }
  };

  const handleFriendsButtonClick = () => {
    navigate("/friends");
  };

  const handleEditIntro = () => {
    setEditIntro(true);
  };

  const handleSaveIntro = async () => {
    try {
      await baseURL.put(`/User/${userData.id}`, {
        ...formData,
        introduction: formData.introduction,
      });
      setUserData({ ...userData, introduction: formData.introduction });
      setEditIntro(false);
    } catch (error) {
      console.error("Error updating introduction:", error);
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handlePostStatus = () => {
    // Logic to post status (e.g., update database, etc.)
    console.log("Posted status:", status);
    setStatus("");
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="row" style={{ marginTop: "100px" }}>
        <div className="col-md-8">
          <div className="card">
            <div className="card-body text-center">
              <img src={userData.img} className="w-50 mb-3" alt="User" />
              <h4>{userData.name}</h4>
              <button className="btn btn-primary btn-sm mx-2">
                Thêm vào tin
              </button>
              <button
                className="btn btn-secondary btn-sm mx-2"
                onClick={handleShowModal}
              >
                Chỉnh sửa trang cá nhân
              </button>
              <button
                className="btn btn-secondary btn-sm mx-2"
                onClick={handleFriendsButtonClick}
              >
                Bạn Bè
              </button>
            </div>
          </div>
          <div className="card mt-3">
            <div className="card-body">
              <h5 className="card-title">Những người bạn có thể biết</h5>
              <div className="d-flex flex-wrap">
                {friendsData.map((user) => (
                  <div className="p-2 text-center" key={user.id}>
                    <img
                      src={user.img}
                      className="rounded"
                      style={{ width: "100px" }}
                      alt={user.name}
                    />
                    <p>{user.name}</p>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddFriend(user)}
                      disabled={friendRequests[user.id]}
                    >
                      {friendRequests[user.id]
                        ? "Đã gửi lời mời"
                        : "Thêm bạn bè"}
                    </button>
                  </div>
                ))}
              </div>
              <a href="#" className="btn btn-link">
                Xem tất cả
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Giới thiệu</h5>
              {editIntro ? (
                <>
                  <textarea
                    className="form-control"
                    value={formData.introduction}
                    onChange={(e) =>
                      setFormData({ ...formData, introduction: e.target.value })
                    }
                  />
                  <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={handleSaveIntro}
                  >
                    Lưu
                  </button>
                </>
              ) : (
                <>
                  <p>{userData.introduction || "Chưa có giới thiệu."}</p>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleEditIntro}
                  >
                    Chỉnh sửa giới thiệu
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Bạn đang nghĩ gì?</h5>
              <textarea
                className="form-control"
                value={status}
                onChange={handleStatusChange}
              />
              <button
                className="btn btn-primary btn-sm mt-2"
                onClick={handlePostStatus}
              >
                Đăng
              </button>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Bạn bè</h5>
              <div className="d-flex flex-wrap">
                {userData.friends?.map((friend) => (
                  <div className="p-2 text-center" key={friend.id}>
                    <img
                      src={friend.img}
                      className="rounded"
                      style={{ width: "100px" }}
                      alt={friend.name}
                    />
                    <p>{friend.name}</p>
                  </div>
                ))}
              </div>
              <a href="#" className="btn btn-link">
                Xem tất cả
              </a>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa thông tin cá nhân</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="formName">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ tên của bạn"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập địa chỉ email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formImg">
              <Form.Label>Ảnh đại diện</Form.Label>
              <Form.Control
                type="text"
                placeholder="URL ảnh đại diện"
                name="img"
                value={formData.img}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
            <Button variant="primary" type="submit">
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
