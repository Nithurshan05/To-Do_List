import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(null); // For editing specific items

    const apiUrl = "http://localhost:8000";

    const handleSubmit = () => {
        if (title.trim() !== "" && description.trim() !== "") {
            const todoData = { title, description };

            if (editId) {
                // Update existing item (Edit)
                fetch(`${apiUrl}/todos/${editId}`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(todoData)
                }).then((res) => {
                    if (res.ok) {
                        setTodos(todos.map(todo => todo.id === editId ? { ...todo, title, description } : todo));
                        setMessage("Item updated successfully...");
                        setEditId(null); // Clear edit mode
                    } else {
                        setError("Unable to update Todo item");
                    }
                });
            } else {
                // Add new item
                fetch(apiUrl + "/todos", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(todoData)
                }).then((res) => {
                    if (res.ok) {
                        setTodos([...todos, { ...todoData }]);
                        setMessage("Item added successfully...");
                    } else {
                        setError("Unable to create Todo item");
                    }
                });
            }
            setTitle("");
            setDescription("");
        }
    };

    const handleDelete = (id) => {
        fetch(`${apiUrl}/todos/${id}`, { method: "DELETE" })
            .then((res) => {
                if (res.ok) {
                    setTodos(todos.filter(todo => todo.id !== id));
                    setMessage("Item deleted successfully...");
                } else {
                    setError("Unable to delete Todo item");
                }
            });
    };

    const handleEdit = (item) => {
        setTitle(item.title);
        setDescription(item.description);
        setEditId(item.id);
    };

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((data) => {
                setTodos(Array.isArray(data) ? data : []);
            })
            .catch(() => setError("Failed to load items"));
    };

    useEffect(() => {
        getItems();
    }, []);

    return (
        <>
            <div className="row p-3 bg-warning border-dark text-dark text-center mt-2 m-2">
                <h1 className="heading1 fw-bold">Todo Project with MERN Stack</h1>
            </div>
            <div className="row m-3">
                <h3>{editId ? "Edit Item" : "Add Item"}</h3>
                {message && <p className="text-success">{message}</p>}
                <div className="form-group d-flex gap-2">
                    <input className="form-control border-dark" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input className="form-control border-dark bg-light" type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <button className="btn btn-dark" type="submit" onClick={handleSubmit}>{editId ? "Update" : "Submit"}</button>
                </div>
                {error && <p className="text-danger">{error}</p>}
            </div>
            <div className="row m-3">
                <h3>Tasks</h3>
                <ul className="list-group m-3 mb-0">
                    {todos.map((item) => (
                        <li key={item.id} className="items-group d-flex justify-content-between bg-info p-3 my-1">
                            <div className="list-items d-flex flex-column">
                                <span className="fw-bold">{item.title}</span>
                                <span>{item.description}</span>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-warning fw-bold" onClick={() => handleEdit(item)}>Edit</button>
                                <button className="btn btn-danger fw-bold" onClick={() => handleDelete(item.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
