"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from "@radix-ui/themes";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import { z } from "zod";

const schema = z.object({
  content: z.string().min(1, "This field is required"),
});

const CommentInput = ({
  parentId,
  editId,
  textValue,
}: {
  parentId?: string | null;
  editId?: string | null;
  textValue?: string | null;
}) => {
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

  const searchParams = useSearchParams();
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, status } = useSession();
  if (status === "loading")
    return (
      <div className="mt-4 rounded-lg">
        <Skeleton width="100%" height={190} />
      </div>
    );
  if (!session?.user) return null;

  const cancel = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("edit");
    params.delete("reply");
    router.replace(pathname, { query: params.toString() });
  };

  const isEditting = searchParams.get("edit");
  const isReplying = searchParams.get("reply");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`comment-input ${editId ? "comment-input__edit" : ""}`}
    >
      <Toaster />
      <div className="textarea-container">
        <textarea
          defaultValue={textValue || ""}
          placeholder={parentId ? "Reply..." : "Add a comment..."}
          ref={ref}
          {...rest}
        />
        <Text color="red">{errors.content?.message}</Text>
      </div>
      {!isEditting && (
        <Image
          src={data?.user?.image || "https://i.stack.imgur.com/34AD2.jpg"}
          alt="profile picture"
          width={32}
          height={32}
          className="rounded-full"
        />
      )}

      <div className="comment-input__btns">
        {(isReplying || isEditting) && (
          <button onClick={() => cancel()} className="uppercase cancel-btn">
            Cancel
          </button>
        )}
        <button className="uppercase">
          {parentId ? "Reply" : editId ? "Edit" : "Send"}
        </button>
      </div>
    </form>
  );

  function onSubmit(data: FieldValues) {
    if (!editId) {
      axios
        .post("/api/comments", {
          content: data.content,
          parentId: parentId || undefined,
        })
        .then((res) => {
          setValue("content", "");
          router.push(pathname, { query: null });
          router.refresh();
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (editId) {
      axios
        .patch(`/api/comments/${editId}`, { content: data.content })
        .then((res) => {
          setValue("content", "");
          router.refresh();
        })
        .catch((error) => {
          toast.error("Couldn't send comment");
        });
    }
  }
};

export default CommentInput;
