// src/components/UserPanel.jsx

import React from "react";
import { usePresentationStore } from "../store/store";

const UserPanel = () => {
  // We'll eventually use WebSocket data to populate this list
  const users = [
    { nickname: "creator_user", role: "creator" },
    { nickname: "editor_user_1", role: "editor" },
    { nickname: "viewer_user_2", role: "viewer" },
  ];

  return (
    <div className="users-panel">
      <h3>Connected Users</h3>
      <div className="user-list">
        {users.map((user, index) => (
          <div key={index} className="user-item">
            <span className="user-nickname">{user.nickname}</span>
            <span className="user-role">({user.role})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPanel;
