import { useState } from "react";
import ToDo from "./ToDo";

const ToDoList = () => {
	const [tasks, setTasks] = useState([]);
	const [newId, setNewId] = useState(1);
	const [newTask, setNewTask] = useState("");

	const handleAddTask = (e) => {
		if (e.key === "Enter" && newTask.trim()) {
			setTasks((prevTasks) => [...prevTasks, { id: newId, value: newTask }]);
			setNewId((prevId) => prevId + 1);
			setNewTask(""); // Clears 'new-task' field
		}
	};

	const handleDeleteTask = (idToDelete) => {
		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== idToDelete));
	};

	return (
		<div>
			<h1>To-Do List</h1>
			<div id="to-do-list">

				{/* Add task Bar */}
				<div className="d-flex align-items-center border-bottom px-5 py-2 text-body-secondary">
					<input
						type="text"
						name="new-task"
						className="my-3 ms-4 me-auto"
						placeholder="Write a new task..."
						value={newTask}
						onChange={(e) => setNewTask(e.target.value)}
						onKeyDown={handleAddTask}
						autoFocus
					/>
				</div>

				{/* To-Do's */}
				{tasks.map((task) => (
					<ToDo key={task.id} value={task.value} deleteTask={() => handleDeleteTask(task.id)} />
				))}

				{/* Items left */}
				<div className="d-flex align-items-center px-4 py-2 text-body-tertiary">
					{tasks.length === 0 ? "There are no tasks. Add tasks." : (
						`${tasks.length} ${tasks.length > 1 ? "items" : "item"} left`
					)}
				</div>
			</div>
		</div>
	);
};

export default ToDoList;