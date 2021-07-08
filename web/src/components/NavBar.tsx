import React, { useEffect } from "react";
import NextLink from "next/link";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import { useApolloClient } from "@apollo/client";

import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { DarkModeSwitch } from "./DarkModeSwitch";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  const apolloClient = useApolloClient();
  let body = null;

  useEffect(() => {
    console.log({ data });
  }, [data]);

  // Data is loading
  if (loading) {
    // User not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
    // User is logged in
  } else {
    body = (
      <Flex align="center">
        <Box>{data.me.username}</Box>
        <NextLink href="/create-post">
          <Button m={2}>
            <Link>Create Post</Link>
          </Button>
        </NextLink>
        <Button
          isLoading={logoutFetching}
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          colorScheme="red"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex position="sticky" top={0} zIndex={1} bg="tomato" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Heading cursor="pointer">LiReddit</Heading>
        </NextLink>
        <Box ml="auto">{body}</Box>
        <DarkModeSwitch />
      </Flex>
    </Flex>
  );
};

export default NavBar;
