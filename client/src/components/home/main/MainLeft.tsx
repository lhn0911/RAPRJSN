import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import api from "../../../../api/index";
import "../Home.scss";

export default function MainLeft({ user }: any) {
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupImage, setNewGroupImage] = useState("");
  const [groupList, setGroupList] = useState(user.groups);
  const [filteredGroups, setFilteredGroups] = useState(user.groups);
  const [filteredFriends, setFilteredFriends] = useState(user.friend);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchGroup, setSearchGroup] = useState("");
  const [searchFriend, setSearchFriend] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);

  useEffect(() => {
    setFilteredGroups(
      groupList.filter((group: any) =>
        group.name.toLowerCase().includes(searchGroup.toLowerCase())
      )
    );
  }, [searchGroup, groupList]);

  useEffect(() => {
    setFilteredFriends(
      user.friend.filter((friend: any) =>
        friend.name.toLowerCase().includes(searchFriend.toLowerCase())
      )
    );
  }, [searchFriend, user.friend]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewGroupName("");
    setNewGroupImage("");
    setErrorMessage("");
    setEditingGroup(null);
  };

  const handleCreateGroup = async () => {
    if (newGroupName.trim() === "" || newGroupImage.trim() === "") {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      const newGroup = {
        name: newGroupName,
        image: newGroupImage,
      };
      const response = await api.post("/groups", newGroup);
      setGroupList([...groupList, response.data]);
      handleCloseModal();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleEditGroup = async () => {
    if (newGroupName.trim() === "" || newGroupImage.trim() === "") {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      const updatedGroup = {
        ...editingGroup,
        name: newGroupName,
        image: newGroupImage,
      };
      const response = await api.put(
        `/groups/${editingGroup.id}`,
        updatedGroup
      );
      setGroupList(
        groupList.map((group) =>
          group.id === editingGroup.id ? response.data : group
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error editing group:", error);
    }
  };

  const handleDeleteGroup = async (id: number) => {
    try {
      await api.delete(`/groups/${id}`);
      setGroupList(groupList.filter((group: any) => group.id !== id));
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleDeleteFriend = (id: number) => {
    setFilteredFriends(
      filteredFriends.filter((friend: any) => friend.id !== id)
    );
  };

  const openEditModal = (group: any) => {
    setEditingGroup(group);
    setNewGroupName(group.name);
    setNewGroupImage(group.image);
    setShowModal(true);
  };

  return (
    <div className="main-left">
      <div className="group-chats">
        <div className="d-flex justify-content-between">
          <h6>Nhóm của bạn</h6>
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <Form.Control
          type="text"
          placeholder="Tìm kiếm nhóm"
          value={searchGroup}
          onChange={(e) => setSearchGroup(e.target.value)}
          className="mb-3"
        />
        {filteredGroups.map((group: any) => (
          <div
            key={group.id}
            className="group-chat d-flex justify-content-between align-items-center"
          >
            <div>
              <img src={group.image} alt={group.name} className="group-img" />
              {group.name}
            </div>
            {user.isAdmin && (
              <DropdownButton
                id="dropdown-basic-button"
                title="..."
                variant="link"
              >
                <Dropdown.Item onClick={() => openEditModal(group)}>
                  Sửa
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleDeleteGroup(group.id)}>
                  Xóa
                </Dropdown.Item>
              </DropdownButton>
            )}
          </div>
        ))}
        <div className="group-chat create-group" onClick={handleShowModal}>
          <span className="material-symbols-outlined">group_add</span>
          Tạo nhóm mới
        </div>
      </div>
      <div className="contacts">
        <div className="d-flex justify-content-between">
          <h6>Người liên hệ</h6>
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <Form.Control
          type="text"
          placeholder="Tìm kiếm người liên hệ"
          value={searchFriend}
          onChange={(e) => setSearchFriend(e.target.value)}
          className="mb-3"
        />
        {filteredFriends.map((friend: any) => (
          <div
            key={friend.id}
            className="contact d-flex justify-content-between align-items-center"
          >
            <div>
              <img
                src={friend.image}
                alt={friend.name}
                className="friend-img"
              />
              {friend.name}
            </div>
            <DropdownButton
              id="dropdown-basic-button"
              title="..."
              variant="link"
            >
              <Dropdown.Item
                onClick={() => alert("Edit friend feature not implemented yet")}
              >
                Sửa
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDeleteFriend(friend.id)}>
                Xóa
              </Dropdown.Item>
            </DropdownButton>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingGroup ? "Chỉnh sửa nhóm" : "Tạo nhóm mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên nhóm</Form.Label>
              <Form.Control
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Nhập tên nhóm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh nhóm</Form.Label>
              <Form.Control
                type="text"
                value={newGroupImage}
                onChange={(e) => setNewGroupImage(e.target.value)}
                placeholder="Nhập URL hình ảnh nhóm"
              />
            </Form.Group>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={editingGroup ? handleEditGroup : handleCreateGroup}
          >
            {editingGroup ? "Chỉnh sửa" : "Tạo nhóm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
