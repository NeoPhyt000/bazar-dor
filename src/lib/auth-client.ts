import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient();

export const { signIn, signUp, signOut, updateUser, useSession } = authClient;


export function getCallbackURL() {
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  return redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
}
