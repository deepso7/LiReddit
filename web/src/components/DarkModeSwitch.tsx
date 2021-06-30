import { useColorMode, Switch, Flex } from "@chakra-ui/react";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <Flex align="center" ml={4}>
      <Switch
        align="center"
        color="green"
        isChecked={isDark}
        onChange={toggleColorMode}
      />
    </Flex>
  );
};
