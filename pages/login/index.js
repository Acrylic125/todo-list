import { Center, Text } from "@mantine/core";
import React from "react";
import LoginForm from "../../components/LoginForm";
import Section from "../../components/Section";

export default function LoginPage() {
  return (
    <Center className="min-h-screen">
      <Section className="w-3/4 min-w-fit max-w-xl">
        <Text className="font-bold" size="lg">
          Login
        </Text>
        <LoginForm />
      </Section>
    </Center>
  );
}
