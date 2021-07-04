import React from "react";
import NextLink from "next/link";
import { Box, IconButton } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [{ data }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();

  if (data?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <NextLink href={`/post/edit/${id}`}>
        <IconButton
          borderRadius="5px"
          mr={4}
          aria-label="edit"
          icon={<EditIcon />}
        />
      </NextLink>
      <IconButton
        borderRadius="5px"
        bg="teal"
        colorScheme="red"
        aria-label="delete"
        icon={<DeleteIcon />}
        onClick={() => {
          deletePost({ id });
        }}
      />
    </Box>
  );
};

export default EditDeletePostButtons;
