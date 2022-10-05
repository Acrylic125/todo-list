import { Table } from "@mantine/core";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "react-query";
import UserPopover from "./UserPopover";

export default function Users({ className }) {
  const { supabaseClient } = useSessionContext();

  const { data: profilesData } = useQuery(["profiles"], async () => {
    const { data: profiles, error: getProfilesError } = await supabaseClient.from("profiles").select(`*, user_roles(*), user_bans(*)`);
    if (getProfilesError) {
      throw getProfilesError;
    }
    return profiles;
  });
  const profiles = profilesData || [];

  const rows = profiles?.map((profile) => {
    return (
      <tr key={profile.id}>
        <td>{profile.id}</td>
        <td>{profile.username}</td>
        <td>{profile.email}</td>
        <td>{profile.user_roles[0]?.role}</td>
        <td>
          <div className="flex flex-row justify-end">
            <UserPopover username={profile.username} profileId={profile.id} />
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
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
}
