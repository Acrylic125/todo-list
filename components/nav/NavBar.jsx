import {
  createStyles,
  Header,
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  ChevronIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: 42,
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
    margin: -theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md * 2}px`,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]}`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

const mockdata = [
  {
    link: "/users",
    title: "Users",
    description: "View and manage users",
  },
];

export default function NavBar({ className }) {
  const [drawer, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const { reload } = useRouter();
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme } = useStyles();
  const { supabaseClient } = useSessionContext();
  const [loadedUser, setLoadedUser] = useState(false);
  const [user, setUser] = useState(null);

  const links = mockdata.map((item) => (
    <Link href={item.link}>
      <UnstyledButton className={classes.subLink} key={item.title}>
        <Group noWrap align="flex-start">
          <div>
            <Text size="sm" weight={500}>
              {item.title}
            </Text>
            <Text size="xs" color="dimmed">
              {item.description}
            </Text>
          </div>
        </Group>
      </UnstyledButton>
    </Link>
  ));

  useEffect(() => {
    (async () => {
      const { data: user, error: getUserError } = await supabaseClient.auth.getUser();
      if (getUserError) {
        console.error(getUserError);
      }
      setUser(user);
      setLoadedUser(true);
    })();
  }, []);

  var loginOrLogout = undefined;
  if (loadedUser) {
    if (user.user) {
      loginOrLogout = (
        <Button
          variant="default"
          onClick={async () => {
            await supabaseClient.auth.signOut();
            reload();
          }}
        >
          Logout
        </Button>
      );
    } else {
      loginOrLogout = (
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      );
    }
  }

  return (
    <Box className={className}>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: "100%" }}>
          <Group sx={{ height: "100%" }} spacing={0} className={classes.hiddenMobile}>
            <Link href="/">
              <span className={classes.link}>My Todos</span>
            </Link>
            <HoverCard width={400} position="bottom" radius="md" shadow="md" withinPortal>
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Admin
                    </Box>
                    <ChevronIcon className={theme.fn.primaryColor()} />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown sx={{ overflow: "hidden" }}>
                <Group position="apart" px="md">
                  <Text weight={500}>Admin</Text>
                </Group>

                <Divider my="sm" mx="-md" color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} />

                <SimpleGrid spacing={0}>{links}</SimpleGrid>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>

          <Group className={classes.hiddenMobile}>{loginOrLogout}</Group>

          <Burger opened={drawer} onClick={toggleDrawer} className={classes.hiddenDesktop} />
        </Group>
      </Header>

      <Drawer opened={drawer} onClose={closeDrawer} size="100%" padding="md" title="Navigation" className={classes.hiddenDesktop} zIndex={1000000}>
        <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
          <Divider my="sm" color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} />

          <Link href="/">
            <span className={classes.link}>My Todos</span>
          </Link>

          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>

          <Divider my="sm" color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} />

          <Group position="center" grow pb="xl" px="md">
            {loginOrLogout}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
