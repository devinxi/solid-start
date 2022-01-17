// import type { LoaderFunction } from "remix";
// import { redirect } from "remix";
// import { getUser } from "src/session.server";

import { Link } from "solid-app-router";

// export const loader: LoaderFunction = async ({ request }) => {
//   const user = await getUser(request);
//   if (user) {
//     return redirect("dashboard");
//   }
//   return redirect("sign-in");
// };

export default function Index() {
  return (
    <div>
      Hello <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}
