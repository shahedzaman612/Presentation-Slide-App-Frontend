// src/components/UserPanel.jsx

import React from "react";

const UserPanel = ({ users }) => {
  return (
    <div className="card shadow-sm mt-3 h-100">
      <div className="card-header">
        <h5 className="card-title mb-0">Connected Users</h5>
      </div>
      <div className="list-group list-group-flush">
        {users && users.length > 0 ? (
          users.map((user, index) => (
            <div key={index} className="list-group-item">
              <span className="user-nickname">{user}</span>
            </div>
          ))
        ) : (
          <p className="p-3 text-muted">No other users connected.</p>
        )}
      </div>
    </div>
  );
};

export default UserPanel;
