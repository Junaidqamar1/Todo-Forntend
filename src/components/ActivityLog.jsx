import React, { useEffect, useState } from "react";
import API from "../api";
import socket from "../socket";

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchLogs();

    socket.on("new-action", (action) => {
      setLogs((prev) => [action, ...prev.slice(0, 19)]); 
    });

    return () => {
      socket.off("new-action");
    };
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/tasks/actions");
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch activity log", err);
    }
  };

  return (
    <div className="activity">
      <div className="head">
        <h4>📜 Activity Log</h4>
        <button onClick={() => setOpen((prev) => !prev)}>
          {open ? "Hide" : "Show"}
        </button>
      </div>

      {open && (
        <ul className="activity-list">
          {logs.map((log, index) => (
            <li key={index} className="activity-item">
              <div>
                <strong>{log.user?.username || "Someone"}</strong> {log.message}
              </div>
              <small>{new Date(log.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLog;
