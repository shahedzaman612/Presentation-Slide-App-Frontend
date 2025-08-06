// src/components/UserPanel.jsx

import React from "react";

const UserPanel = ({ users }) => {
  return (
    <div className="users-panel">
      <h3>Connected Users</h3>
      <div className="user-list">
        {users && users.length > 0 ? (
          users.map((user, index) => (
            <div key={index} className="user-item">
              <span className="user-nickname">{user}</span>
            </div>
          ))
        ) : (
          <p>No other users connected.</p>
        )}
      </div>
    </div>
  );
};

export default UserPanel;
