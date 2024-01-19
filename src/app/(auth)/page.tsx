import AdminPage from "@/components/admin-page";
import FocalPage from "@/components/focal-page";
import ReceiverPage from "@/components/receiver-page";
import { getPageSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getPageSession();

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <main className="container py-8">
      {user.role === "admin" && <AdminPage />}
      {user.role === "focal" && <FocalPage />}
      {user.role === "receiver" && <ReceiverPage />}
    </main>
  );
}
