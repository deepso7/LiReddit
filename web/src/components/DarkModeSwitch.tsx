import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useColorMode, Flex } from "@chakra-ui/react";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <Flex align="center" ml={4}>
      {isDark ? (
        <MoonIcon
          align="center"
          onClick={toggleColorMode}
          cursor="pointer"
          w={5}
          h={5}
        />
      ) : (
        <SunIcon
          align="center"
          onClick={toggleColorMode}
          cursor="pointer"
          w={5}
          h={5}
        />
      )}
    </Flex>
  );
};
