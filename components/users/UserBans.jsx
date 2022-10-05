import { Table, Text } from "@mantine/core";
import { useSessionContext } from "@supabase/auth-helpers-react";
import moment from "moment";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { formatDateTime, formatDuration } from "../../utils/string-utils";
import UserBanPopover from "./UserBanPopover";

export default function UserBans({ className }) {
  const { supabaseClient } = useSessionContext();
  const queryClient = useQueryClient();
  const [now] = useState(() => new Date());

  const { data: userBansData } = useQuery(["bans"], async () => {
    const { data: userBans, error: getUserBansError } = await supabaseClient.from("user_bans").select(`*, profiles!inner(username)`);
    if (getUserBansError) {
      throw getUserBansError;
    }
    return userBans;
  });
  const userBans = userBansData || [];

  const { mutate: revokeBan } = useMutation(
    async (banId) => {
      const { data, error } = await supabaseClient.from("user_bans").delete().eq("id", banId);
      if (error) {
        throw error;
      }
      return data;
    },
    {
      onMutate: (banId) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        queryClient.cancelQueries(["bans"]);
        const previous = queryClient.getQueryData(["bans"]);
        queryClient.setQueryData(["bans"], (old) => old.filter((ban) => ban.id !== banId));

        // Return a context object with the snapshotted value
        return { previous };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(["bans"], context.previous);
      },
      onSettled: (newTodo, error, variables, options) => {
        // Refetch the todos after the mutation is done.
        queryClient.invalidateQueries(["bans"]);
      },
    }
  );

  const rows = userBans?.map((ban) => {
    const banExpiresIn = moment(ban.expires).diff(now);
    return (
      <tr key={ban.id}>
        <td>{ban.id}</td>
        <td>{ban.profiles.username}</td>
        <td>
          <Text>{formatDateTime(ban.expires)}</Text>
          <Text className="opacity-50" size="xs">
            Expires in: {banExpiresIn <= 0 ? "Already Expired" : formatDuration(banExpiresIn)}
          </Text>
        </td>
        <td>
          <Text className="w-full max-w-xl">{ban.reason}</Text>
        </td>
        <td>
          <div className="flex flex-row justify-end">
            <UserBanPopover revokeBan={revokeBan} banId={ban.id} />
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div className={className}>
      <Table className="w-full" highlightOnHover>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Expiry</th>
            <th>Reason</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
}
