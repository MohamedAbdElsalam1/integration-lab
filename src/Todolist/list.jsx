import { useState, useEffect } from "react";
import { axiosInstance }  from "../axios.config";

const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axiosInstance.get("/todos");
      console.log(response)
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEdit = async (todo) => {
    const updatedTask = prompt("Enter the updated task:", todo.taskName);
    if (updatedTask) {
      try {
        await axiosInstance.put(`/todos/${todo.id}`, {
          taskName: updatedTask,
          isCompleted: todo.isCompleted,
        });
        fetchTodos();
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    }
  };

  const handleDone = async (todo) => {
    try {
      await axiosInstance.put(`/todos/${todo.id}`, {
        taskName: todo.taskName,
        isCompleted: !todo.isCompleted,
      });
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() !== "") {
      try {
        await axiosInstance.post("/todos", {
          taskName: newTask,
          isCompleted: false,
        });
        setNewTask("");
        fetchTodos();
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  return (
    <div className="todolist">
      <div className="search" onSubmit={addTask}>
        <input type="text" placeholder="Search ex: todo 1" />
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          type="text"
          value={newTask}
          onChange={handleChange}
          placeholder="Add a task........"
        />
        <button className="addtask-btn">Add Task</button>
      </form>
      <div className="lists">
        {todos?.map((todo) => (
          <div
            key={todo.id}
            className={`list ${todo.isCompleted ? "completed" : ""}`}
          >
            <p> {todo.taskName}</p>
            <div className="span-btns">
              {!todo.isCompleted && (
                <span onClick={() => handleDone(todo)} title="completed">
                  ✓
                </span>
              )}
              <span
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                title="delete"
              >
                x
              </span>
              <span
                className="edit-btn"
                onClick={() => handleEdit(todo)}
                title="edit"
              >
                ↻
              </span>
            </div>
          </div>
        ))}
        {!todos?.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;


