import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function EditTodoForm({ defaultTitle, onEdit, onDelete }) {
  const form = useForm({
    initialValues: {
      title: defaultTitle,
    },
    validate: {
      title: (value) => (value.length > 0 ? null : "Please type out what you want to do"),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(({ title }) => {
        onEdit({
          title,
        });
      })}
    >
      <Stack my="md">
        <TextInput label="Title" className="w-full" placeholder="Title" required {...form.getInputProps("title")} />
        <div className="flex flex-row gap-2">
          <Button type="submit">Save</Button>
          <Button
            color="red"
            onClick={() => {
              if (onDelete) {
                onDelete();
              }
            }}
          >
            Delete
          </Button>
        </div>
      </Stack>
    </form>
  );
}
