"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from "@radix-ui/themes";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LegacyRef, useRef } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import { z } from "zod";

const schema = z.object({
  content: z.string().min(1, "This field is required"),
});

const CommentInput = ({ parentId }: { parentId?: string | null }) => {
  type commentForm = z.infer<typeof schema>;
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<commentForm>({
    resolver: zodResolver(schema),
  });

  const { ref, ...rest } = register("content");

  const { data } = useSession();
  const router = useRouter();

  const { data: session, status } = useSession();
  if (status === "loading")
    return (
      <div className="mt-4 rounded-lg">
        <Skeleton width="100%" height={190} />
      </div>
    );
  if (!session?.user) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="comment-input ">
      <Toaster />
      <div className="textarea-container">
        <textarea placeholder="Add a comment..." ref={ref} {...rest} />
        <Text color="red">{errors.content?.message}</Text>
      </div>
      <Image
        src={data?.user?.image || "https://i.stack.imgur.com/34AD2.jpg"}
        alt="profile picture"
        width={32}
        height={32}
        className="rounded-full"
      />
      <button className="uppercase">{parentId ? "Reply" : "Send"}</button>
    </form>
  );

  function onSubmit(data: FieldValues) {
    axios
      .post("/api/comments", {
        content: data.content,
        parentId: parentId ? parentId : undefined,
      })
      .then((res) => {
        setValue("content", "");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Couldn't send comment");
      });
  }
};

export default CommentInput;
