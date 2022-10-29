import { useSupabaseClient } from "@supabase/auth-helpers-react";
import cx from "classnames";
import { DateTime } from "luxon";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEllipsisV } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "react-query";
import TextareaAutosize from "react-textarea-autosize";
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
    const due_on = e.target.value;
    setDueOnEditFocus(false);
    if (DateTime.fromISO(due_on).isValid) {
      onRequestEdit({
        id,
        due_on,
      });
    }
  }

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
          >
            {DateTime.fromISO(dueOn).toFormat("LLL dd, yyyy")}
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

const Todos = () => {
  const queryClient = useQueryClient();
  const supabaseClient = useSupabaseClient();
  const { data: todos } = useQuery(["todos"], async () => {
    const {
      data: { user },
      error: getUserError,
    } = await supabaseClient.auth.getUser();
    if (getUserError) {
      throw getUserError;
    }

    const { data: todos, error: getTodosError } = await supabaseClient.from("todos").select("*").eq("user_id", user.id);
    if (getTodosError) {
      throw getTodosError;
    }

    return todos;
  });
  const { mutate: updateTodo } = useMutation(
    async (newTodo) => {
      const { data, error } = await supabaseClient.from("todos").update(newTodo).eq("id", newTodo.id);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onMutate: async (newTodo) => {
        // We are NOT cancelling the request to delete the todo, we are cancelling
        // any requests to REFETCH the todos. We will always want to refetch the
        // once after any set of mutations.
        await queryClient.cancelQueries(["todos"]);
        const previous = queryClient.getQueryData(["todos"]);

        queryClient.setQueryData(["todos"], (old) => {
          return old.map((todo) => {
            if (todo.id === newTodo.id) {
              return { ...todo, ...newTodo };
            }
            return todo;
          });
        });

        return {
          previous,
        };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(["todos"], context.previous);
      },
      onSettled: (newTodo, error, variables, options) => {
        // Refetch the todos after the mutation is done.
        queryClient.invalidateQueries(["todos"]);
      },
    }
  );
  const { mutate: deleteTodo } = useMutation(
    async (todoId) => {
      const { data, error } = await supabaseClient.from("todos").delete().eq("id", todoId);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onMutate: async (todoId) => {
        // We are NOT cancelling the request to delete the todo, we are cancelling
        // any requests to REFETCH the todos. We will always want to refetch the
        // once after any set of mutations.
        await queryClient.cancelQueries(["todos"]);
        const previous = queryClient.getQueryData(["todos"]);

        // We optimistically update the todos by removing the todo that is being deleted.
        queryClient.setQueryData(
          ["todos"],
          todos.filter((todo) => todo.id !== todoId)
        );

        return {
          previous,
        };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(["todos"], context.previous);
      },
      onSettled: (newTodo, error, variables, options) => {
        // Refetch the todos after the mutation is done.
        queryClient.invalidateQueries(["todos"]);
      },
    }
  );

  if (todos === undefined || todos.length === 0) {
    return (
      <div className="flex justify-center justi">
        <p className="py-4">You don't have any todos yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div>
      {todos.map((todo) => {
        return (
          <Todo
            key={todo.id}
            id={todo.id}
            defaultTitle={todo.title}
            defaultCompleted={todo.completed}
            dueOn={todo.due_on}
            completed={todo.completed}
            onRequestEdit={updateTodo}
            onRequestDelete={deleteTodo}
            className="p-4"
          />
        );
      })}
    </div>
  );
};

const CreateTodo = ({ className }) => {
  const queryClient = useQueryClient();
  const supabaseClient = useSupabaseClient();
  const {
    register,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm();
  const { mutate: createTodo } = useMutation(
    async (newTodo) => {
      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();
      if (userError) {
        throw new userError();
      }
      if (!user) {
        throw new Error("No user found");
      }

      const { data, error } = await supabaseClient.from("todos").insert({ title: newTodo.title, user_id: user.id, due_on: newTodo.due_on });
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onMutate: async (newTodo) => {
        // We are NOT cancelling the request to delete the todo, we are cancelling
        // any requests to REFETCH the todos. We will always want to refetch the
        // once after any set of mutations.
        await queryClient.cancelQueries(["todos"]);
        const previous = queryClient.getQueryData(["todos"]);

        // console.log(newTodo);
        queryClient.setQueryData(["todos"], (old) => {
          return [
            ...old,
            {
              id: Math.random(),
              title: newTodo.title,
              due_on: newTodo.due_on,
              completed: false,
              isLoading: true,
            },
          ];
        });

        return {
          previous,
        };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(["todos"], context.previous);
      },
      onSettled: (newTodo, error, variables, options) => {
        // Refetch the todos after the mutation is done.
        queryClient.invalidateQueries(["todos"]);
      },
    }
  );

  function submit(data) {
    createTodo({
      title: data.title,
      due_on: data.due_on,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className={className}>
      <div className="flex flex-row gap-4">
        <input
          {...register("title", {
            required: "Title is required",
            maxLength: {
              message: "Title must be less than 255 characters",
              value: 255,
            },
          })}
          type="text"
          placeholder="Add a todo"
          className={cx("input input-bordered flex-1", {
            "input-error": errors.title !== undefined && submitCount > 0,
          })}
        />
        <input
          {...register("due_on", {
            required: "Due date is required",
          })}
          type="date"
          className={cx("input input-bordered", {
            "input-error": errors.due_on !== undefined && submitCount > 0,
          })}
        />
        <button type="submit" className="btn btn-primary">
          Add Todo
        </button>
      </div>
    </form>
  );
};

const Page = () => {
  return (
    <div className="w-full flex flex-col gap-4 max-w-7xl mx-auto px-4">
      <h1 className="font-bold text-lg px-4">My Todos</h1>
      <CreateTodo className="px-4" />
      <Todos />
    </div>
  );
};

export default Page;
