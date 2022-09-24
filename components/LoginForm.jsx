import { Button, Text, TextInput, Col, Stack, Alert, Group, Loader, Center } from "@mantine/core";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useForm } from "@mantine/form";
import React from "react";

export default function LoginForm() {
  const { supabaseClient } = useSessionContext();
  const [formState, setFormState] = React.useState("idle");
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const login = async (email) => {
    setFormState("loading");
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
    });
    if (error) {
      setFormState("error");
      console.error(error);
    } else {
      setFormState("success");
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(({ email }) => {
        login(email);
      })}
    >
      <Stack spacing="lg">
        <TextInput label="EMail" {...form.getInputProps("email")} />

        {formState === "error" && (
          <Alert color="red" title="Error">
            There was an error logging in.
          </Alert>
        )}
        {formState === "success" && (
          <Alert color="green" title="Success">
            Check your email for a login link.
          </Alert>
        )}
        <Group>
          <Button disabled={formState === "loading"} type="submit">
            Login
          </Button>
          {formState === "loading" && <Loader size="sm" />}
        </Group>
      </Stack>
    </form>
  );
}
