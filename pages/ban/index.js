import React, { useEffect, useState } from "react";

import { Alert, Center, Space, Stack, Text } from "@mantine/core";
import moment from "moment";
import momentDurationSetup from "moment-duration-format";
import Section from "../../components/Section";
import withPageAuthWrap from "../../utils/withPageAuthWrap";

momentDurationSetup(moment);

export default function Index({ bans = [] }) {
  /**
   * Why is this a state and declared on mount?
   * When NextJS SSR renders this page, it will render the page with the current time.
   * However, when the page is hydrated, the time will be the time when the page was hydrated.
   */
  const [currentDate, setCurrentDate] = useState(null);
  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const sortedBans = bans.sort((a, b) => {
    return moment(a.expires).isBefore(b.expires) ? 1 : -1;
  });

  return (
    <Center px="md" py="md">
      <Stack className="w-full max-w-5xl" my="md">
        <Section>
          {sortedBans.length > 0 ? (
            <>
              <Text align="center" weight="bold">
                You are currently banned from this website.
              </Text>
              <Text align="center">
                {currentDate !== null &&
                  `You will be unbanned in ${moment
                    .duration(moment(sortedBans[0].expires).diff(currentDate))
                    .format("y[y] M[m] d[d] h[h] m[min] s[s]")}`}
              </Text>
            </>
          ) : (
            <>
              <Text align="center" weight="bold">
                You are not currently banned from this website.
              </Text>
              <Text align="center">You can continue to use the website as normal.</Text>
            </>
          )}
        </Section>
        {sortedBans.length > 0 &&
          currentDate !== null &&
          sortedBans.map((ban) => {
            return (
              <Alert
                key={ban.id}
                title={<Text>Expires in {moment.duration(moment(ban.expires).diff(currentDate)).format("y[y] M[m] d[d] h[h] m[min] s[s]")}</Text>}
                color="red"
              >
                <Text>Banned on {moment(ban.created_at).format("MMMM DD, YYYY, hh:mm:ss")}</Text>
                <Space h="md" />
                <Text>{ban.reason}</Text>
              </Alert>
            );
          })}
      </Stack>
    </Center>
  );
}

export const getServerSideProps = withPageAuthWrap({}, [
  async (ctx, supabaseClient) => {
    const {
      data: { user },
      error: getUserError,
    } = await supabaseClient.auth.getUser();
    if (getUserError) {
      throw getUserError;
    }

    const { data: bans, error: getBansError } = await supabaseClient
      .from("user_bans")
      .select("*")
      .eq("user_id", user.id)
      .gt("expires", new Date().toISOString());
    if (getBansError) {
      throw getBansError;
    }

    return {
      props: {
        bans,
      },
    };
  },
]);
