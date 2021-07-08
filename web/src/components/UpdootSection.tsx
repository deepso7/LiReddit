import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import gql from "graphql-tag";

import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import { ApolloCache } from "@apollo/client";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });
  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();

  const handleClick = async (doot: any) => {
    if (doot === "updoot-loading") {
      if (post.voteStatus === 1) {
        return;
      }
      setLoadingState("updoot-loading");
      await vote({
        variables: { postId: post.id, value: 1 },
        update: (cache) => updateAfterVote(1, post.id, cache),
      });
    } else if (doot === "downdoot-loading") {
      if (post.voteStatus === -1) {
        return;
      }
      setLoadingState("downdoot-loading");
      await vote({
        variables: { postId: post.id, value: -1 },
        update: (cache) => updateAfterVote(-1, post.id, cache),
      });
    }
    setLoadingState("not-loading");
  };

  return (
    <Flex direction="column" alignItems="center" mr={4}>
      <IconButton
        aria-label="Updoot post"
        borderRadius="5px"
        // variant="outline"
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        icon={<ChevronUpIcon />}
        isLoading={loadingState === "updoot-loading"}
        onClick={() => handleClick("updoot-loading")}
      />
      {post.points}
      <IconButton
        aria-label="Downdoot post"
        borderRadius="5px"
        // variant="outline"
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        icon={<ChevronDownIcon />}
        isLoading={loadingState === "downdoot-loading"}
        onClick={() => handleClick("downdoot-loading")}
      />
    </Flex>
  );
};

export default UpdootSection;
