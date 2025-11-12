import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getSessionAndAdminFromServer = createServerFn({
  method: "GET",
}).handler(async () => {
  const reqHeaders = getRequestHeaders();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user.email) {
    return { session: null, isAdmin: false };
  }

  const result = await db
    .select({
      isAdmin: user.isAdmin,
    })
    .from(user)
    .where(eq(user.email, session.user.email));

  return {
    session,
    isAdmin: result[0].isAdmin,
  };
});

type SessionAndAdmin = Awaited<ReturnType<typeof getSessionAndAdminFromServer>>;
export type Session = SessionAndAdmin["session"];
