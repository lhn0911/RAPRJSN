import React, { useEffect, useState } from "react";
import "../Home.scss";

interface Group {
  id: string;
  name: string;
  image: string;
}

interface User {
  name: string;
  avatar: string;
}

interface MainRightProps {
  currentUser: User;
  groups: Group[];
}

export default function MainRight({ currentUser, groups }: MainRightProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser); // Cập nhật user state khi prop currentUser thay đổi
      console.log("Current user updated:", currentUser);
    }
  }, [currentUser]);

  return (
    <div className="main-right">
      <div className="user-info">
        {user && (
          <div className="user-profile">
            <img src={user.img} alt={user.name} className="user-img" />
            <div className="user-name">{user.name}</div>
          </div>
        )}
        <div className="user-menu">
          <div className="user-menu-item">
            <i className="fa-solid fa-user-group"></i>
            Bạn bè
          </div>
          <div className="user-menu-item">
            <i className="fa-solid fa-calendar"></i>
            Kỷ niệm
          </div>
          <div className="user-menu-item">
            <i className="fa-solid fa-bookmark"></i>
            Đã lưu
          </div>
          <div className="user-menu-item">
            <span className="material-symbols-outlined">group</span>
            Nhóm
          </div>
          <div className="user-menu-item">
            <i className="fa-solid fa-tv"></i>
            Video
          </div>
          <div className="user-menu-item">
            <i className="fa-solid fa-arrow-down"></i>
            Xem thêm
          </div>
        </div>
      </div>
      <div className="user-activities">
        <h3>Lối tắt của bạn</h3>
        {groups.map((group: Group) => (
          <div key={group.id} className="user-activity">
            <img src={group.image} alt={group.name} className="group-img" />
            {group.name}
          </div>
        ))}
      </div>
    </div>
  );
}
