"use client";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

const DeleteComment = ({
  commentId,
  parentPath,
}: {
  commentId: string;
  parentPath?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const isDeleting = searchParams.get("delete") === commentId;
  const cancel = () => {
    localStorage.setItem("persistentScroll", window.scrollY.toString());
    const params = new URLSearchParams(searchParams);
    params.delete("delete");
    router.replace(pathname, { query: params.toString() });
  };

  const deleteComment = () => {
    setIsLoading(true);

    axios
      .delete(`/api/comments/${commentId}`)
      .then((res) => {
        if (!parentPath) router.push("/comments");
        else router.push(`/comments/${parentPath}`);
        router.refresh();
      })
      .catch((error) => {
        toast.error("Couldn't delete comment");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <Dialog.Root open={isDeleting}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Delete comment</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Are you sure you want to delete this comment? This will remove the
          comment and can’t be undone.
        </Dialog.Description>

        <Flex gap="3" mt="4" justify="center">
          <Dialog.Close>
            <Button
              size="4"
              onClick={() => cancel()}
              variant="soft"
              color="gray"
              style={{ backgroundColor: "#0000330f" }}
            >
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button
              style={{ backgroundColor: "var(--Soft-Red)" }}
              size="4"
              onClick={() => deleteComment()}
            >
              {isLoading ? <Spinner /> : "Delete"}
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeleteComment;
