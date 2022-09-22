import { Button, Text, TextInput } from "@mantine/core";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import React from "react";

export default function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [showGoToEmail, setShowGoToEmail] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const login = async () => {
    setLoading(true);
    const { user, error } = await supabaseClient.auth.signInWithOtp({
      email,
    });
    if (error) {
      setErrorMessage(error?.message || "Unknown error!");
    } else {
      setShowGoToEmail(true);
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
      {showGoToEmail && <Text color="dimmed">Please check your email for the OTP code and enter it below.</Text>}
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
