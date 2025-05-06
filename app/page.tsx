import { Chat } from "@/components/chat"
import { ModeToggle } from "@/components/mode-toggle"
import { UserMenu } from "@/components/user-menu"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-14 sm:h-16 w-full shrink-0 items-center justify-between border-b bg-background px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-semibold">MentalHS-Ai</h1>
        </div>
        <div className="flex items-center gap-2">
          <UserMenu />
          <ModeToggle />
        </div>
      </header>
      <main className="flex flex-1 flex-col md:pr-[350px]">
        <Chat />
      </main>
    </div>
  )
}
