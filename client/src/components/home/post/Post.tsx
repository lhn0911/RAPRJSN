import React from "react";
import moment from "moment"; // Import thư viện moment để xử lý thời gian
import Dropdown from "react-bootstrap/Dropdown";

const Post = ({ post, comments, currentUser, onEdit, onDelete }) => {
  const postComments = comments.filter(
    (comment) => comment.post_id === post.id
  );

  // Function to handle editing a post
  const handleEditClick = () => {
    if (onEdit) {
      onEdit(post);
    }
  };

  // Function to handle deleting a post
  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(post.id);
    }
  };

  // Format thời gian hiện tại
  const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

  return (
    <div className="post">
      <div className="post-header d-flex justify-content-between align-items-center">
        <div className="post-user-info d-flex align-items-center">
          <img src={post.userImg} alt={post.user} className="user-avatar" />
          <div>
            <div className="post-user">{post.user}</div>
            <div className="post-time">{currentTime}</div>
          </div>
        </div>
        {currentUser && currentUser.name === post.user && (
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              <span className="material-symbols-outlined">more_horiz</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleEditClick}>Chỉnh sửa</Dropdown.Item>
              <Dropdown.Item onClick={handleDeleteClick}>Xóa bài</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      <div className="post-content">{post.content}</div>
      {Array.isArray(post.image) &&
        post.image.length > 0 && ( // Check if post.image is an array before mapping
          <div className="post-images">
            {post.image.map((img: any, index) => (
              <img
                key={index}
                src={img}
                alt={`post-image-${index}`}
                className="post-img"
              />
            ))}
          </div>
        )}
      <div className="post-stats">
        <span>👍❤️😆 {post.like}</span>
        <span>{post.comment} bình luận</span>
      </div>
      <div className="post-actions">
        <button>👍 Thích</button>
        <button>💬 Bình luận</button>
        <button>🔗 Chia sẻ</button>
      </div>
      <div className="post-comments">
        {postComments.map((comment, index) => (
          <div key={index} className="post-comment">
            <img
              src={comment.userImage}
              alt={comment.username}
              className="comment-user-avatar"
            />
            <div className="comment-content">
              <strong>{comment.username}</strong> {comment.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
