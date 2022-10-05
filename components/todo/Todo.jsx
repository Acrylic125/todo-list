import { Checkbox, Modal } from "@mantine/core";
import moment from "moment/moment";
import { memo, useState } from "react";
import { formatDate } from "../../utils/string-utils";
import Section from "../Section";
import EditTodoForm from "./EditTodoForm";

const Todo = ({ id, title, completed, createdAt, onUpdate, onDelete, canEdit, className }) => {
  const [editing, setEditing] = useState(false);

  const update = (newTodo) => {
    if (onUpdate) {
      onUpdate({ id, ...newTodo });
    }
  };

  return (
    <>
      <Modal
        centered
        title="Edit todo"
        opened={canEdit && editing}
        onClose={() => {
          setEditing(false);
        }}
      >
        <EditTodoForm
          defaultTitle={title}
          onDelete={() => {
            if (onDelete) {
              onDelete(id);
            }
          }}
          onEdit={({ title }) => {
            update({ id, title });
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
              {createdAt && <p className="whitespace-nowrap">{formatDate(createdAt)}</p>}
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};

export default memo(Todo);
