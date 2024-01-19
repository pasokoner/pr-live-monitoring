import LoginForm from "@/components/login-form";
import Link from "next/link";

export default function Page() {
  return (
    <main className="container min-h-screen max-w-lg py-20">
      <div className="mb-4">
        <p className="text-gray-600">Login your account</p>
      </div>
      <LoginForm />
    </main>
  );
}
