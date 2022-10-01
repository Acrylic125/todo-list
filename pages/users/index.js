import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Button, Center, Table } from "@mantine/core";
import React from "react";
import Section from "../../components/Section";

export default function Users({ profiles }) {
  console.log(profiles);
  const rows = profiles.map((profile) => {
    return (
      <tr key={profile.id}>
        <td>{profile.id}</td>
        <td>{profile.name}</td>
        <td>{profile.email}</td>
        <td>{profile.role}</td>
        <td>
          <Button color="gray">Edit</Button>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <Center>
        <Section className="w-3/4 max-w-7xl">
          <Table highlightOnHover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Section>
      </Center>
    </div>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
  getServerSideProps: async ({ req, res }, supabaseClient) => {
    const {
      data: { user },
      getUserError,
    } = await supabaseClient.auth.getUser();
    if (getUserError) {
      throw getUserError;
    }

    const {
      data: [userRole],
      error: getUserRoleError,
    } = await supabaseClient.from("user_roles").select("*").eq("user_id", user.id);
    if (getUserRoleError) {
      throw getUserRoleError;
    }

    if (userRole?.role !== "admin") {
      res.writeHead(302, { Location: "/" });
      res.end();
      return { props: {} };
    }

    const { data: profiles, error: getProfilesError } = await supabaseClient.from("profile_with_roles").select(`
      *
    `);
    if (getProfilesError) {
      throw getProfilesError;
    }
    console.log(profiles);

    return {
      props: {
        profiles: profiles || null,
      },
    };
  },
});
