import { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();

  const handleClick = async (doot: any) => {
    if (doot === "updoot-loading") {
      if (post.voteStatus === 1) {
        return;
      }
      setLoadingState("updoot-loading");
      await vote({ postId: post.id, value: 1 });
    } else if (doot === "downdoot-loading") {
      if (post.voteStatus === -1) {
        return;
      }
      setLoadingState("downdoot-loading");
      await vote({ postId: post.id, value: -1 });
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
