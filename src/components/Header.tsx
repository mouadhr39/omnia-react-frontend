import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Separator } from "@base-ui/react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ResolvedIcon } from "@/lib/iconutils"

import CreateProjectDialog from "@/components/dialog/CreateProject"

const SettingsDropdownMenu: React.FC = () => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-lg"
              className="m-1"
              onClick={() => console.log("bot click")}
            >
            <ResolvedIcon name="Settings2" className="" />
            </Button>
          }
        />
        <DropdownMenuContent
          className="w-40 rounded-2xl border-black bg-background"
          align="start"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Setting group 1</DropdownMenuLabel>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

const DropDownMenuCreate: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="default">Add Items</Button>}
      />
      <DropdownMenuContent className="w-40 bg-background" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>GitHub</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuItem disabled>API</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const Header: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <header className="flex h-14 shrink-0 flex-row items-center justify-between gap-2 border-b p-2">
      <div className="flex flex-row items-center justify-center">
        <SidebarTrigger variant="ghost" size="icon-lg" className="m-1 p-4" />
      </div>
      <div className="m-4 flex">
        <h1>Omnia v. 1.0</h1>
      </div>
      <div className="flex flex-row items-center justify-center">
        
       
        <Separator orientation="vertical" className="m-4 gap-4 text-white" />
        <Button
          variant="ghost"
          size="icon-lg"
          className=""
          onClick={() => console.log("bot click")}
        >
          <ResolvedIcon name="User" className="" />
        </Button>
        <SettingsDropdownMenu />
        {children}
      </div>
    </header>
  )
}

export default Header
