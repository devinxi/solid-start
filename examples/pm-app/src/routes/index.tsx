import type { LoaderFunction } from "remix";
import { redirect } from "remix";
import { getUser } from "src/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) {
    return redirect("dashboard");
  }
  return redirect("sign-in");
};
