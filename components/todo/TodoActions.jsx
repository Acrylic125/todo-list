import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { Popover } from "react-tiny-popover";

const TodoActions = ({ onRequestDelete }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <Popover
      content={
        <div className="bg-neutral py-2 shadow-md rounded-md">
          <ul>
            <li>
              <button onClick={onRequestDelete} className="hover:bg-neutral-focus flex flex-row items-center gap-4 px-4 text-left">
                Delete
              </button>
            </li>
          </ul>
        </div>
      }
      isOpen={isPopoverOpen}
      positions={["left", "bottom", "top", "right"]}
      onClickOutside={() => {
        setIsPopoverOpen(false);
      }}
    >
      <div
        onClick={() => {
          setIsPopoverOpen(!isPopoverOpen);
        }}
      >
        <FaEllipsisV />
      </div>
    </Popover>
  );
};

export default TodoActions;
