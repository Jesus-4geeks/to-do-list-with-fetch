import { useState } from "react";

export const ToDo = ({ value, deleteTask, isDeleting = false }) => {
    const [showIcon, setShowIcon] = useState(false);

    return (
        <div
            className="d-flex align-items-center border-bottom px-5 py-2 text-body-secondary"
            onMouseEnter={() => setShowIcon(true)}
            onMouseLeave={() => setShowIcon(false)}
        >
            <input
                type="text"
                name="to-do"
                className="my-2 ms-4 me-auto"
                value={value}
                disabled
            />

            {/* Contenedor fijo para el icono/spinner */}
            <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isDeleting ? (
                    <div className="spinner-border spinner-border-sm text-danger" role="status">
                        <span className="visually-hidden">Deleting...</span>
                    </div>
                ) : (
                    showIcon && (
                        <span className="icon rounded-circle" onClick={deleteTask}>
                            <i className="fa-solid fa-xmark"></i>
                        </span>
                    )
                )}
            </div>
        </div>
    );
};