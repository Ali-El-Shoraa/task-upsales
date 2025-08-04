import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form } from "react-router-dom";

export default function Navbar() {
  const user = {
    name: "أحمد",
    image: "https://i.pravatar.cc/100",
  };

  return (
    <header className="w-full border-b bg-white dark:bg-zinc-900 shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16">
        <div className="text-xl font-bold text-blue-600">MyApp</div>

        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <Form method="POST">
            <Button
              variant="outline"
              size="icon"
              title="تسجيل الخروج"
              className="hover:bg-red-50 dark:hover:bg-red-900"
            >
              <LogOut className="h-5 w-5 text-red-600" />
            </Button>
          </Form>
        </div>
      </div>
    </header>
  );
}
