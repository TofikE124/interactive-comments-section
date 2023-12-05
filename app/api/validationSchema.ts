import { VoteType } from "@prisma/client";
import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().min(1, "This field is required").max(65355),
  parentId: z.string().optional(),
});

const VoteTypeArr = Object.values(VoteType);

export const voteSchema = z.object({
  commentId: z.number().min(1),
  voteType: z.enum([VoteTypeArr[0], ...VoteTypeArr.slice(1)]),
});
