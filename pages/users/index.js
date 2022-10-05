import React from "react";
import UsersDashboardLayout from "../../components/layouts/UsersDashboardLayout";
import Users from "../../components/users/Users";
import banProtected from "../../utils/banProtected";
import roleRequired from "../../utils/roleRequired";
import withPageAuthWrap from "../../utils/withPageAuthWrap";

export default function Index() {
  return <Users className="overflow-x-auto w-full max-w-7xl" />;
}

Index.getLayout = (page) => {
  return <UsersDashboardLayout defaultActive="Users">{page}</UsersDashboardLayout>;
};

export const getServerSideProps = withPageAuthWrap({}, [banProtected(), roleRequired(["admin"])]);
