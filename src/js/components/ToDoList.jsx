import { useState, useEffect } from "react";
import { ToDo } from "./ToDo";
import { todoAPI } from "../services/todoAPI.js";

const ToDoList = () => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [loading, setLoading] = useState(true);
	const [isAddingTask, setIsAddingTask] = useState(false);
	const [isClearingAll, setIsClearingAll] = useState(false);
	const [deletingIds, setDeletingIds] = useState(new Set());
	const [error, setError] = useState(null);

	const refreshTasks = async () => {
		try {
			const todos = await todoAPI.getTodos();
			setTasks(todos);
		} catch (error) {
			setError('Error refreshing tasks: ' + error.message);
		}
	};

	useEffect(() => {
		const initializeTodos = async () => {
			try {
				setLoading(true);
				setError(null);
				
				const todos = await todoAPI.getTodos();
				setTasks(todos);
			} catch (error) {
				if (error.message.includes('404')) {
					try {
						await todoAPI.createUsername();
						setTasks([]);
					} catch (createError) {
						setError('Error initializing user: ' + createError.message);
					}
				} else {
					setError('Error loading todos: ' + error.message);
				}
			} finally {
				setLoading(false);
			}
		};

		initializeTodos();
	}, []);

	const handleAddTask = async (e) => {
		if (e.key === "Enter" && newTask.trim() && !isAddingTask) {
			const taskToAdd = newTask.trim();
			
			try {
				setIsAddingTask(true);
				setNewTask("");
				
				const newTodo = {
					label: taskToAdd,
					done: false
				};

				await todoAPI.createTodo(newTodo);
				await refreshTasks();
			} catch (error) {
				setError('Error adding task: ' + error.message);
				console.error('Error adding task:', error);
				setNewTask(taskToAdd);
			} finally {
				setIsAddingTask(false);
			}
		}
	};

	const handleDeleteTask = async (todoId) => {
		if (deletingIds.has(todoId)) return;
		
		try {
			setDeletingIds(prev => new Set(prev).add(todoId));
			
			await todoAPI.deleteTodo(todoId);
			await refreshTasks();
		} catch (error) {
			setError('Error deleting task: ' + error.message);
			console.error('Error deleting task:', error);
		} finally {
			setDeletingIds(prev => {
				const newSet = new Set(prev);
				newSet.delete(todoId);
				return newSet;
			});
		}
	};

	const handleClearAllTasks = async () => {
		if (isClearingAll) return;
		
		try {
			setIsClearingAll(true);
			
			await todoAPI.deleteAllTodos();
			setTasks([]);
		} catch (error) {
			setError('Error clearing all tasks: ' + error.message);
			console.error('Error clearing all tasks:', error);
		} finally {
			setIsClearingAll(false);
		}
	};

	const handleClearError = () => {
		setError(null);
	};

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
				<div className="spinner-border" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h1>To-Do List (with Fetch)</h1>
			
			{error && (
				<div className="alert alert-danger alert-dismissible" role="alert">
					{error}
					<button 
						type="button" 
						className="btn-close" 
						onClick={handleClearError}
						aria-label="Close"
					></button>
				</div>
			)}

			<div id="to-do-list">
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
					
					<div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						{isAddingTask && (
							<div className="spinner-border spinner-border-sm text-secondary" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						)}
					</div>
				</div>

				{tasks.map((task) => (
					<ToDo 
						key={task.id} 
						value={task.label} 
						deleteTask={() => handleDeleteTask(task.id)}
						isDeleting={deletingIds.has(task.id)}
					/>
				))}

				<div className="d-flex align-items-center justify-content-between px-4 py-2 text-body-tertiary">
					<span>
						{tasks.length === 0 ? "There are no tasks. Add tasks." : (
							`${tasks.length} ${tasks.length > 1 ? "items" : "item"} left`
						)}
					</span>
					
					{tasks.length > 0 && (
						<button 
							className="btn btn-outline-danger btn-sm"
							onClick={handleClearAllTasks}
							disabled={isClearingAll}
						>
							{isClearingAll ? (
								<>
									<span className="spinner-border spinner-border-sm me-2" role="status"></span>
									Clearing...
								</>
							) : (
								"Clear All"
							)}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ToDoList;