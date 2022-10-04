import { Checkbox, Modal } from "@mantine/core";
import moment from "moment/moment";
import { useState } from "react";
import Section from "../Section";
import EditTodoForm from "./EditTodoForm";

export default function Todo({ title, completed, createdAt, onUpdate, onDelete, className }) {
  const [editing, setEditing] = useState(false);

  const update = (newTodo) => {
    if (onUpdate) {
      onUpdate({ title, completed, ...newTodo });
    }
  };

  return (
    <>
      <Modal
        centered
        title="Edit todo"
        opened={editing}
        onClose={() => {
          setEditing(false);
        }}
      >
        <EditTodoForm
          defaultTitle={title}
          onDelete={() => {
            if (onDelete) {
              onDelete();
            }
          }}
          onEdit={({ title }) => {
            update({ title });
            setEditing(false);
          }}
        />
      </Modal>
      <div
        onClick={() => {
          setEditing(true);
        }}
      >
        <Section py="sm" className={className}>
          <div className="w-full gap-4 flex flex-row ">
            <Checkbox
              checked={completed}
              onClick={(event) => {
                event.stopPropagation();
              }}
              onChange={(event) => {
                update({ completed: event.currentTarget.checked });
              }}
            />
            <div className="flex flex-row gap-4 items-center justify-between w-full">
              <h5>{title}</h5>
              {createdAt && <p className="whitespace-nowrap">{moment(createdAt).format("MMM DD, YYYY")}</p>}
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
