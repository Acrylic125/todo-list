import { Alert, Button, Center, Modal, Popover, Stack, Table, Text, Textarea } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useSessionContext } from "@supabase/auth-helpers-react";
import moment from "moment";
import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import Section from "../../components/Section";
import banProtected from "../../utils/banProtected";
import roleRequired from "../../utils/roleRequired";
import withPageAuthWrap from "../../utils/withPageAuthWrap";

function BanUserForm({ isLoading, onBan }) {
  const form = useForm({
    initialValues: {
      expires: new Date(),
      time: new Date(),
      reason: "",
    },
    validate: {
      reason: (value) => (value.length >= 65535 ? "Reason must be less than 65535 characters" : null),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(({ expires, time, reason }) => {
        onBan({
          expires: moment(expires).set("hours", time.getHours()).set("minutes", time.getMinutes()).toDate(),
          reason,
        });
      })}
    >
      <Stack my="md">
        <div className="w-full gap-4 items-end flex flex-row">
          <DatePicker required className="w-full" label="Expires On" {...form.getInputProps("expires")} />
          <TimeInput required format="24" {...form.getInputProps("time")} />
        </div>
        <Textarea autosize minRows={1} maxRows={5} label="Reason" {...form.getInputProps("reason")} />
        <div>
          <Button loading={isLoading} color="red" type="submit">
            Ban User
          </Button>
        </div>
      </Stack>
    </form>
  );
}

function BanUserModal({ opened, onClose, onBan, username, profileId }) {
  const { supabaseClient } = useSessionContext();
  const queryClient = useQueryClient();
  const {
    mutate: banUser,
    isSuccess,
    isError,
    isLoading,
  } = useMutation(
    async (options) => {
      const { data, error } = await supabaseClient.from("user_bans").insert({
        user_id: options.user_id,
        expires: options.expires,
        reason: options.reason,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    {
      onMutate: async (options) => {
        await queryClient.cancelQueries(["ban-profile", options.user_id]);
        const previous = queryClient.getQueryData(["ban-profile", options.user_id]);
        queryClient.setQueryData(["ban-profile", options.user_id], options);
        return { options, previous };
      },
      onError: async (error, variables, options) => {
        queryClient.setQueryData(["ban-profile", options.user_id], options.previous);
      },
      onSettled: async (data, error, options) => {
        queryClient.invalidateQueries(["ban-profile", options.user_id]);
      },
    }
  );

  return (
    <Modal centered opened={opened} onClose={onClose} title={<Text weight="bold">{username || "No Name"} Bans</Text>}>
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

function UserPopover({ onBan, profileId }) {
  const [opened, { close, open }] = useDisclosure(false);
  const [modal, setModal] = React.useState(null);

  return (
    <>
      <div onMouseEnter={open} onMouseLeave={close}>
        <Popover opened={opened}>
          <Popover.Target>
            <Button px="sm" color="gray">
              <FaEllipsisV />
            </Button>
          </Popover.Target>
          <Popover.Dropdown px="sm">
            <div>
              <Button
                onClick={() => {
                  setModal("ban");
                }}
                fullWidth
                compact
                variant="subtle"
                color="gray"
              >
                <p>Edit User</p>
              </Button>
              <Button
                onClick={() => {
                  setModal("ban");
                }}
                fullWidth
                compact
                variant="subtle"
                color="red"
              >
                <p>Ban User</p>
              </Button>
            </div>
          </Popover.Dropdown>
        </Popover>
      </div>

      {modal === "ban" && <BanUserModal onBan={onBan} opened onClose={() => setModal(null)} profileId={profileId} />}
    </>
  );
}

export default function Users({ defaultProfiles }) {
  const [profiles, setProfiles] = useState(defaultProfiles);

  const rows = profiles?.map((profile) => {
    return (
      <tr key={profile.id}>
        <td>{profile.id}</td>
        <td>{profile.username}</td>
        <td>{profile.email}</td>
        <td>{profile.user_roles[0]?.role}</td>
        <td>Ban</td>
        <td className="flex flex-row justify-end">
          <UserPopover profileId={profile.id} />
        </td>
      </tr>
    );
  });

  return (
    <Center>
      <Section className="overflow-x-auto w-3/4 max-w-7xl">
        <Table className="w-full" highlightOnHover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Banned</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Section>
    </Center>
  );
}

export const getServerSideProps = withPageAuthWrap({}, [
  banProtected(),
  roleRequired(["admin"]),
  async ({ res }, supabaseClient) => {
    const { data: profiles, error: getProfilesError } = await supabaseClient.from("profiles").select(`*, user_roles(*), user_bans(*)`);
    if (getProfilesError) {
      throw getProfilesError;
    }

    return {
      data: {
        defaultProfiles: profiles || null,
      },
    };
  },
]);
