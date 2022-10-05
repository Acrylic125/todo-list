import { Alert, Modal, Stack, Text } from "@mantine/core";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "react-query";
import BanUserForm from "./BanUserForm";

export default function BanUserModal({ opened, onClose, onBan, username, profileId }) {
  const { supabaseClient } = useSessionContext();
  const {
    mutate: banUser,
    isSuccess,
    isError,
    isLoading,
  } = useMutation(async (options) => {
    const { data, error } = await supabaseClient.from("user_bans").insert({
      user_id: options.user_id,
      expires: options.expires,
      reason: options.reason,
    });
    if (error) {
      throw error;
    }
    return data;
  });

  return (
    <Modal centered opened={opened} onClose={onClose} title={<Text weight="bold">{username || "No Name"}'s Bans</Text>}>
      <Stack my="md">
        <Alert color="blue" title="Note">
          <Text>Banned users will not be able to use their account.</Text>
        </Alert>
        {isSuccess && (
          <Alert color="green" title="Success">
            <Text>The user was successfully banned!</Text>
          </Alert>
        )}
        {isError && (
          <Alert color="red" title="Error">
            <Text>There was an error banning the user.</Text>
          </Alert>
        )}
      </Stack>

      <BanUserForm
        isLoading={isLoading}
        onBan={({ expires, reason }) => {
          banUser({ user_id: profileId, expires, reason });

          if (typeof onBan === "function")
            onBan({
              user_id: profileId,
              expires,
              reason,
            });
        }}
      />
    </Modal>
  );
}
