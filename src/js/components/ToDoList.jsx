import { useState, useEffect } from "react";
import ToDo from "./ToDo";

const ToDoList = () => {
	const [tasks, setTasks] = useState([]);
	const [newId, setNewId] = useState(0);
	const [newTask, setNewTask] = useState("");

	const playgroundAPI = "https://playground.4geeks.com/todo";
	const myUsername = "jesus-4geeks";

	const handleAddTask = (e) => {
		if (e.key === "Enter" && newTask.trim()) {
			const todo = { id: newId, label: newTask, is_done: false };
			setTasks((prevTasks) => [...prevTasks, todo]);
			const ok = postTodo(todo);
			
			/* Si todo va bien, actualizamos las demás variables */
			if (ok) {
				setNewId((prevId) => prevId + 1);
				setNewTask(""); // Clears 'new-task' field
				/* alert('Todo creado con exito') */
			}
			else {
				getTodos(); // Restaura los Todos
			}
		}
	};

	const handleDeleteTask = (idToDelete) => {
		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== idToDelete));
		const ok = deleteTodo(idToDelete);

		if (ok) {
			/* alert('Todo eliminado con exito') */
		}
		else {
			getTodos(); // Restaura los Todos
		}
	};

	/* Métodos CRUD */

	const postUser = async () => {
		try {
			const response = await fetch(`${playgroundAPI}/users/${myUsername}`, {
				method: "POST"
			})
	
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

		} catch (error) {
			alert(`Hubo un error al crear el usuario ${myUsername}`);
			console.error('error: ', error);
		}
		finally {
			alert(`Usuario ${myUsername} creado con exito`)
		}
	};
	
	
	const deleteUser = async () => {
		try {
			const response = await fetch(`${playgroundAPI}/users/${myUsername}`, {
				method: "DELETE"
			})
			
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

		} catch (error) {
			alert(`Hubo un error al eliminar el usuario ${myUsername}`);
			console.error('error: ', error);
		}
		finally {
			setTasks([]);
			setNewId(0);
			alert('Usuario eliminado con exito')
		}
	};


	const getTodos = async () => {
		try {
			const response = await fetch(`${playgroundAPI}/users/${myUsername}`);
			let contentType = response.headers.get('content-type');

			/* Si no existe el usuario, se crea y se vuelve a intentar el GET */
			if (response.status === 404) {
				await postUser();
				return await getTodos();
			}

			if (!(response.ok && contentType && contentType.includes("application/json"))) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			
			const data = await response.json();
			setTasks(data.todos);
			/* alert('Todos cargados con exito'); */
			
		} catch (error) {
			alert('Hubo un error al cargar los Todos');
			console.error('error: ', error);
		}
	};
	
	
	const postTodo = async (todo) => {
		try {
			const response = await fetch(`${playgroundAPI}/todos/${myUsername}`, {
				method: 'POST',
				body: JSON.stringify(todo),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			return response.ok;
			
		} catch (error) {
			alert('Hubo un error al crear el nuevo Todo');
			console.error('error: ', error);
		}
	};
	
	
	const deleteTodo = async (todo_id) => {
		try {
			const response = await fetch(`${playgroundAPI}/todos/${todo_id}`, {
				method: 'DELETE'
			});
			
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			return response.ok;
			
		} catch (error) {
			alert(`Hubo un error al eliminar el Todo con id: ${todo_id}`);
			console.error('error: ', error);
		}
	};


	useEffect(() => {
		/* Cargamos las tareas al inicio */
		getTodos();
	}, [])

	return (
		<div>
			<h1>To-Do List (with Fetch)</h1>
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
					<ToDo key={task.id} value={task.label} deleteTask={() => handleDeleteTask(task.id)} />
				))}

				{/* Items left */}
				<div className="d-flex align-items-center px-4 py-2 text-body-tertiary">
					{tasks.length === 0 ? "There are no tasks. Add tasks." : (
						`${tasks.length} ${tasks.length > 1 ? "items" : "item"} left`
					)}

					<span className="ms-auto">
						<button
							className="btn btn-danger"
							onClick={deleteUser}
						>
							Eliminar usuario
						</button>
					</span>
				</div>
			</div>
		</div>
	);
};

export default ToDoList;