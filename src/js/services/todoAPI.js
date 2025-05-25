const API_BASE = 'https://playground.4geeks.com/todo';
const myUsername = 'jesus-4geeks'

export const todoAPI = {
    async getTodos() {
        try {
            const response = await fetch(`${API_BASE}/users/${myUsername}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.todos || [];
        } catch (error) {
            console.error('Error fetching todos:', error);
            throw error;
        }
    },

    async createUsername() {
        try {
            const response = await fetch(`${API_BASE}/users/${myUsername}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating username:', error);
            throw error;
        }
    },

    async createTodo(todo) {
        try {
            const response = await fetch(`${API_BASE}/todos/${myUsername}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(todo),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error;
        }
    },

    async deleteTodo(todo_id) {
        try {
            const response = await fetch(`${API_BASE}/todos/${todo_id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return { success: true, status: response.status };
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    },

    async deleteAllTodos() {
        try {
            const todos = await this.getTodos();
            
            // Eliminar todas las tareas una por una
            const deletePromises = todos.map(todo => this.deleteTodo(todo.id));
            await Promise.all(deletePromises);
            
            return { success: true };
        } catch (error) {
            console.error('Error deleting all todos:', error);
            throw error;
        }
    }
};