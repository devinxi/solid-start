import type { ActionFunction } from "remix";
import { deleteProject } from "src/db.server";
import { requireUser } from "src/session.server";
import { redirect } from "remix";

export const action: ActionFunction = async ({ request, params }) => {
  await requireUser(request, {
    redirect: "/sign-in"
  });
  const projectId = params.projectId as string;
  if (projectId) {
    try {
      await deleteProject(projectId);
    } catch (e) {
      console.error(e);
    }
  }
  return redirect("/dashboard");
};
