import React, { useEffect, useState } from "react";
import API from "../api";
import socket from "../socket";
import TaskForm from "./TaskForm";
import ActivityLog from "./ActivityLog";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";



const Board = () => {
  const navigate = useNavigate();

  const [flippedCards, setFlippedCards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(false)
  const columns = ["Todo", "In Progress", "Done"];
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const handleCardFlip = (taskId) => {
    setFlippedCards((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };



  useEffect(() => {
    fetchTasks();

    socket.on("task-created", (task) => {
      setTasks((prev) => [...prev, task]);
    });

    socket.on("task-updated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    });

    socket.on("task-deleted", (deletedId) => {
      setTasks((prev) => prev.filter((t) => t._id !== deletedId));
    });

    return () => {
      socket.off("task-created");
      socket.off("task-updated");
      socket.off("task-deleted");
    };
  }, []);

  const smartAssign = async (taskId) => {
    try {
      const res = await API.post(`/tasks/${taskId}/smart-assign`);
      socket.emit("update-task", res.data);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data : t))
      );
    } catch (err) {
      console.error("Smart assign failed", err.message);
    }
  };

  const delettask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      socket.emit("task-deleted", taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Delete failed", err.message);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;

      const updatedTask = {
        ...task,
        status: newStatus,
        lastModified: task.lastModified,
      };

      const res = await API.put(`/tasks/${taskId}`, updatedTask);
      socket.emit("update-task", res.data);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data : t))
      );
    } catch (err) {
      if (err.response?.status === 409) {
        const { currentTask, attemptedUpdate } = err.response.data;

        const confirmOverwrite = window.confirm(
          `⚠️ Conflict detected!\n\n` +
          `Your version of "${attemptedUpdate.title}" is outdated.\n` +
          `Latest status: ${currentTask.status}\n` +
          `Do you want to overwrite it with "${attemptedUpdate.status}"?`
        );

        if (confirmOverwrite) {
          try {
            const overwriteRes = await API.put(`/tasks/${taskId}`, {
              ...attemptedUpdate,
              lastModified: new Date().toISOString(),
            });

            socket.emit("update-task", overwriteRes.data);
            setTasks((prev) =>
              prev.map((t) => (t._id === taskId ? overwriteRes.data : t))
            );
          } catch (overwriteErr) {
            console.error("Error overwriting task", overwriteErr.message);
          }
        }
      } else {
        console.error("Error updating status", err.message);
      }
    }
  };
  function handleLogout() {
  localStorage.removeItem("token");
 
    window.location.reload();

}

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;
    await updateStatus(draggableId, destination.droppableId);
  };

  return (
    <div className="board">
      <div className="cret-form">
        <h3>Create Task</h3>
        {form ? (
          <button onClick={() => (setForm(!form))}>close</button>
        ) : (
          <button onClick={() => (setForm(!form))}>open</button>
        )}
        {form && (
          <TaskForm onTaskCreated={(task) => setTasks((prev) => [...prev, task])} />
        )}
      </div>
      {/* <ActivityLog /> */}
      <h1>Task Board</h1>

      <DragDropContext onDragEnd={onDragEnd}  >
        <div className="koban-board">
          {columns.map((col) => (
            <Droppable droppableId={col} key={col}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="table"
                >
                  <h3>{col}</h3>
                  <div className="collt">
                  {tasks
                    .filter((task) => task.status === col)
                    .map((task, index) => (
                      <Draggable draggableId={task._id} index={index} key={task._id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`task-card ${flippedCards.includes(task._id) ? "flipped" : ""}`}
                            onClick={() => handleCardFlip(task._id)}
                          >
                            <div className="card-inner">
                              <div className="card-front">
                                <strong>{task.title}</strong>
                                <small>Assigned: {task.assignedTo?.username || "N/A"}</small>
                                <div>
                                <button onClick={(e) => { e.stopPropagation(); smartAssign(task._id); }} className="smrt">🧠 Smart Assign</button>
                                  <button onClick={(e) => { e.stopPropagation(); delettask(task._id); }}>🗑️ Delete</button>
                                </div>
                              </div>
                              <div className="card-back">
                                <p>{task.description}</p>
                                <div style={{ marginTop: 8 }}>
                                  
                                </div>
                              </div>
                            </div>
                          </div>

                        )}
                      </Draggable>
                    ))}
                    </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <ActivityLog/>
      <button onClick={handleLogout} className="logout" >Logout</button>
    </div>
  );
};

export default Board;
