import React, { useState, useEffect } from "react";
import baseURL from "../../../../../PTITSN/client/src/api/index";
import "./Friend.scss"; // Đổi tên file CSS thành SCSS

export default function Friend() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await baseURL.get("/User");
        const loggedInUser = response.data.find(
          (user: any) => user.status === true
        );
        setUser(loggedInUser);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };
    fetchData();
  }, []);

  const handleAccept = async (friendId: any) => {
    try {
      // 1. Cập nhật trạng thái lời mời kết bạn
      const updatedUser = {
        ...user,
        addfriend: user.addfriend.map((friend: any) =>
          friend.id === friendId ? { ...friend, status: true } : friend
        ),
      };

      // 2. Thêm bạn mới vào danh sách bạn bè
      const newFriend = user.addfriend.find(
        (friend: any) => friend.id === friendId
      );
      updatedUser.friend = [
        ...(user.friend || []),
        { id: newFriend.id, name: newFriend.name },
      ];

      // 3. Cập nhật dữ liệu trên server
      await baseURL.put(`/User/${user.id}`, updatedUser);

      // 4. Cập nhật trạng thái local
      setUser(updatedUser);
    } catch (error) {
      console.error("Lỗi khi chấp nhận lời mời kết bạn:", error);
    }
  };

  const handleReject = async (friendId: any) => {
    try {
      // 1. Xóa lời mời kết bạn
      const updatedUser = {
        ...user,
        addfriend: user.addfriend.filter(
          (friend: any) => friend.id !== friendId
        ),
      };

      // 2. Cập nhật dữ liệu trên server
      await baseURL.put(`/User/${user.id}`, updatedUser);

      // 3. Cập nhật trạng thái local
      setUser(updatedUser);
    } catch (error) {
      console.error("Lỗi khi từ chối lời mời kết bạn:", error);
    }
  };

  if (!user) return <div>Đang tải...</div>;

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <div className="sidebar">
        <h3>Danh mục</h3>
        <ul>
          <li>Gợi ý kết bạn</li>
          <li>Lời mời kết bạn</li>
          <li>Tất cả bạn bè</li>
          <li>Sinh nhật</li>
          <li>Danh sách tùy chỉnh</li>
        </ul>
      </div>
      <div className="main">
        <h2>Những người bạn có thể biết</h2>
        {user.addfriend &&
          user.addfriend.map((friend: any) => (
            <div
              key={friend.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <img
                src={friend.img}
                alt={friend.name}
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
              <span style={{ marginLeft: "10px" }}>{friend.name}</span>
              <button
                onClick={() => handleAccept(friend.id)}
                style={{ marginLeft: "10px" }}
                disabled={friend.status}
              >
                {friend.status ? "Đã chấp nhận" : "Chấp nhận"}
              </button>
              <button
                onClick={() => handleReject(friend.id)}
                style={{ marginLeft: "10px" }}
                disabled={friend.status}
              >
                Từ chối
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
