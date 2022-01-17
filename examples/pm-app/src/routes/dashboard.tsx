import { Link, Outlet } from "solid-app-router";
import { createResource } from "solid-js";
import server from "solid-start/server";
// import stylesUrl from "~/styles/routes/dashboard.css";
// import { NavLink } from "~/ui/link";
// import { MaxContainer } from "~/ui/max-container";
// import { Heading, Section } from "~/ui/section-heading";
// import { requireUser } from "~/session.server";

// export const loader = async ({ request }) => {
//   const { passwordHash, ...secureUser } = await requireUser(request, {
//     redirect: "/sign-in"
//   });
//   return {
//     user: secureUser
//   };
// };

// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: stylesUrl }];
// };

// export const meta: MetaFunction = ({ params, data, location, parentsData }) => {
//   let userName: string | null = parentsData?.root?.user?.name ?? null;
//   userName = "Chance";
//   return {
//     title: `Welcome${userName?.padStart(userName.length + 1) || ""}! | PM Camp`,
//     description: "Welcome to PM Camp"
//   };
// };

const navItems = [
  //   { label: "Notifications", to: "notifications" },
  //   { label: "Search", to: "search" },
  { label: "Sign Out", to: "/sign-out" }
];

// function Layout({
//   currentYear,
//   children
// }: React.PropsWithChildren<{ currentYear?: string | number }>) {
//   return (
//     <div className="dashboard-layout__container">
//       <header className="dashboard-layout__header">
//         <MaxContainer className="dashboard-layout__header-inner">
//           <div>
//             <Heading level={3} className="dashboard-layout__home-heading">
//               <NavLink to="." className="dashboard-layout__home-link">
//                 PM Camp
//               </NavLink>
//             </Heading>
//           </div>
//           <div>
//             <nav className="dashboard-layout__nav">
//               <ul className="dashboard-layout__nav-list">
//                 {navItems.map(({ label, to }) => {
//                   return (
//                     <li key={label} className="dashboard-layout__nav-item">
//                       <NavLink to={to} className="dashboard-layout__nav-link">
//                         {label}
//                       </NavLink>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </nav>
//           </div>
//         </MaxContainer>
//       </header>
//       <main className="dashboard-layout__main">
//         <Section>{children}</Section>
//       </main>
//       <footer className="dashboard-layout__footer">
//         <MaxContainer>
//           <div className="dashboard-layout__copyright">&copy; {currentYear} Remix Software</div>
//         </MaxContainer>
//       </footer>
//     </div>
//   );
// }
import fs from "fs";
import { prisma } from "~/db.server";

// const p = prisma;

export default function DashboardLayout() {
  // let { currentYear } = useLoaderData();
  const [data] = createResource(
    server(async () => {
      try {
        return {
          hello: fs.readFileSync(new URL(import.meta.url).pathname, { encoding: "utf-8" }),
          prisma: await prisma.todo.findMany()
        };
      } catch (e) {
        console.error(e);
      }
    })
  );

  return (
    <div>
      Hello world
      <pre>{JSON.stringify(data(), null, 2)}</pre>
      <Link href="/">Sign out</Link>
      <Outlet />
    </div>
  );
}

// export function CatchBoundary() {
//   const caught = useCatch();

//   switch (caught.status) {
//     case 401:
//     case 404:
//       return (
//         <Layout currentYear="2021">
//           <h1>
//             {caught.status} -- {caught.statusText}
//           </h1>
//         </Layout>
//       );

//     default:
//       throw new Error(`Unexpected caught response with status: ${caught.status}`);
//   }
// }

// export function ErrorBoundary() {
//   return (
//     <Layout currentYear="2021">
//       <p>sdlkjfskdljfklsdajfklsdfjlksdjfkldsj</p>
//     </Layout>
//   );
// }
