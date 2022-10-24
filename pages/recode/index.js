import cx from "classnames";
import { DateTime } from "luxon";
import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { Popover } from "react-tiny-popover";

const Todo = ({ title, createdAt, completed, className }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <div className={cx(className, "flex flex-row gap-4 hover:bg-neutral-focus")}>
      <input type="checkbox" className="checkbox" checked={completed} />
      <h5 className="flex-1">{title}</h5>
      <div className="flex flex-row gap-4 items-center">
        <p>{DateTime.fromISO(createdAt).toFormat("LLL dd, yyyy")}</p>
        <Popover
          content={
            <div className="bg-neutral py-2 shadow-md rounded-md">
              <ul>
                <li>
                  <button className="hover:bg-neutral-focus flex flex-row items-center gap-4 px-4 text-left">Delete</button>
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
      </div>
    </div>
  );
};

const Page = () => {
  const todos = [
    {
      id: 1,
      title: "Learn Next.js",
      created_at: "2021-08-01T00:00:00.000Z",
      completed: false,
    },
  ];
  return (
    <div className="w-full flex flex-col gap-4 max-w-7xl mx-auto px-4">
      <h1 className="font-bold text-lg px-4">My Todos</h1>
      <div className="flex flex-row gap-4 px-4">
        <input type="text" placeholder="Add a todo" className="input input-bordered flex-1" />
        <button className="btn btn-primary">Add Todo</button>
      </div>
      {todos.map((todo) => {
        return <Todo key={todo.id} title={todo.title} createdAt={todo.created_at} completed={todo.completed} className="p-4" />;
      })}
    </div>
  );
};

export default Page;
