import React from "react";
import NextLink from "next/link";
import { Box, Button, Flex, Link } from "@chakra-ui/react";

import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { DarkModeSwitch } from "./DarkModeSwitch";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  let body = null;

  // Data is loading
  if (fetching) {
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
        <Box mr={4}>{data.me.username}</Box>
        <Button
          isLoading={logoutFetching}
          onClick={() => logout()}
          colorScheme="red"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex position="sticky" top={0} zIndex={1} bg="tomato" p={4}>
      <Box ml="auto">{body}</Box>
      <DarkModeSwitch />
    </Flex>
  );
};

export default NavBar;
