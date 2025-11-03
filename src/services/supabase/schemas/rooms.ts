import z from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(1, "Room name is required").trim(),
  isPublic: z.boolean(),
  tags: z.array(z.string()).default([]).catch([]),
});
