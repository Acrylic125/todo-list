import cx from "classnames";
import { DateTime } from "luxon";
import { memo, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import TodoActions from "./TodoActions";

const Todo = ({ id, defaultTitle, defaultCompleted, dueOn, onRequestDelete, onRequestEdit, className }) => {
  const [titleEditFocus, setTitleEditFocus] = useState(false);
  const [dueOnEditFocus, setDueOnEditFocus] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [completed, setCompleted] = useState(defaultCompleted);

  function unfocusTitleEdit() {
    setTitleEditFocus(false);
    onRequestEdit({
      id,
      title,
    });
  }
  function focusTitleEdit() {
    setTitleEditFocus(true);
  }
  function unfocusKeyboard(e) {
    if (e.key === "Escape") {
      unfocusTitleEdit();
    }
  }
  function handleCompletedChange(e) {
    setCompleted(e.target.checked);
    onRequestEdit({
      id,
      completed: e.target.checked,
    });
  }
  function handleTitleChange(e) {
    setTitle(e.target.value);
  }
  function handleDueOnChange(e) {
    const dueOn = e.target.value;
    setDueOnEditFocus(false);
    if (DateTime.fromISO(dueOn).isValid) {
      onRequestEdit({
        id,
        due_on: dueOn,
      });
    }
  }

  const dueOnDateTime = DateTime.fromISO(dueOn);

  return (
    <div className={cx(className, "flex flex-row gap-4 hover:bg-neutral-focus")}>
      <input type="checkbox" onChange={handleCompletedChange} className="checkbox" checked={completed} />
      {titleEditFocus ? (
        <TextareaAutosize
          autoFocus
          onKeyDown={unfocusKeyboard}
          onBlur={unfocusTitleEdit}
          onChange={handleTitleChange}
          className="flex-1 textarea p-0"
          defaultValue={title}
        />
      ) : (
        <h5 className="flex-1" onClick={focusTitleEdit}>
          {title}
        </h5>
      )}

      <div className="flex flex-row gap-4 items-center">
        {dueOnEditFocus ? (
          <input type="date" className="input" defaultValue={dueOn} autoFocus onBlur={handleDueOnChange} />
        ) : (
          <p
            onClick={() => {
              setDueOnEditFocus(true);
            }}
            className={cx({
              "text-error": !dueOnDateTime.isValid || dueOnDateTime.diffNow().as("days") < 0,
            })}
          >
            {dueOnDateTime.toFormat("LLL dd, yyyy")}
          </p>
        )}

        <TodoActions
          onRequestDelete={() => {
            if (onRequestDelete) {
              onRequestDelete(id);
            }
          }}
        />
      </div>
    </div>
  );
};

export default memo(Todo);
