import { Button, Text, TextInput } from "@mantine/core";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import React from "react";

export default function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const login = async () => {
    setLoading(true);
    const { user, error } = await supabaseClient.auth.signInWithOtp({
      email,
    });
    if (error) {
      setErrorMessage(error?.message || "Unknown error!");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col ">
      <div className="flex flex-row">
        <TextInput
          label="EMail"
          value={email}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
          }}
        />
        <Button onClick={login}>Login</Button>
      </div>
      {loading && <Text color="dimmed">Loading...</Text>}
      {errorMessage && (
        <div>
          <Text align="center" size="sm" mt="xs" color="red">
            {errorMessage}
          </Text>
        </div>
      )}
    </div>
  );
}
