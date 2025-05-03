import { useState } from "react";

const ToDo = ({ value, deleteTask }) => {
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

            {/* Shows icon just when hovered */}
            {showIcon && (
                <span className="icon rounded-circle" onClick={deleteTask}>
                    <i className="fa-solid fa-xmark"></i>
                </span>
            )}
        </div>
    );
};

export default ToDo;