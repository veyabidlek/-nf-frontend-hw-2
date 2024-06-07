"use client";
import Image from "next/image";
import TaskItem from "./components/TaskItem";
import TaskList from "./components/TaskList";
import { useState, useEffect } from "react";
const task = { id: 1, text: "Todo Test", completed: false };

export default function Home() {
  const [tasks, setTasks] = useState([task]);
  const [filter, setFilter] = useState("all");
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });
  useEffect(() => {
    const data = localStorage.getItem("my-list");
    if (data) {
      setTasks(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      localStorage.setItem("my-list", JSON.stringify(tasks));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
  });

  const activeNum = tasks.filter((task) => !task.completed).length;

  const handleAddTask = () => {
    const taskInput = document.getElementById("taskInput");
    if (!taskInput.value) {
      return;
    }
    const newTask = {
      id: tasks.length + 1,
      text: taskInput.value,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    taskInput.value = "";
    console.log("new task added");
  };

  const handleToggleTask = (id) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">TODO</h1>
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          id="taskInput"
          className="bg-gray-800 text-white border-none rounded p-4 flex-grow"
          placeholder="What to do ?"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white p-4 rounded ml-4"
        >
          Add Task
        </button>
      </div>
      <div className="bg-gray-800 rounded p-4">
        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
        />
        <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
          <span> {activeNum} items left</span>{" "}
          <div>
            <button
              onClick={() => setFilter("all")}
              className={`mr-2 ${filter === "all" ? "text-white" : ""}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`mr-2 ${filter === "active" ? "text-white" : ""}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`${filter === "completed" ? "text-white" : ""}`}
            >
              Completed
            </button>
          </div>
          <button
            onClick={() => setTasks(tasks.filter((task) => !task.completed))}
            className="text-gray-400 hover:text-white"
          >
            Clear Completed
          </button>
        </div>
      </div>
    </div>
  );
}
