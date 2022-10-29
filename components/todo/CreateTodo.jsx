import { useSupabaseClient } from "@supabase/auth-helpers-react";
import cx from "classnames";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

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

export default CreateTodo;
