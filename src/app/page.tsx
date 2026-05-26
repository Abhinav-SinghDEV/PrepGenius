import { redirect } from "next/navigation";

export default function HomePage() {
  // This executes on the server side instantly, bypassing browser caching issues
  redirect("/register");
}