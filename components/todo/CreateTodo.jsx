import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function CreateTodo({ onRequestCreateTodo }) {
  const form = useForm({
    initialValues: {
      todo: "",
    },
    validate: {
      todo: (value) => (value.length > 0 ? null : "Please type out what you want to do"),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(({ todo }) => {
        onRequestCreateTodo(todo);
      })}
      className="flex flex-row gap-4"
    >
      <TextInput className="w-full" placeholder="Add a todo" required {...form.getInputProps("todo")} />
      <Button type="submit">Add</Button>
    </form>
  );
}
