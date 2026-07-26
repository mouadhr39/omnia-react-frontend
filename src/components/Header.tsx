import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ResolvedIcon } from '@/lib/iconutils';


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
              onClick={() => console.log('bot click')}
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
  );
};


const Header: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <header className="flex h-12 shrink-0 flex-row items-center justify-between gap-2  p-3 bg-sidebar">
      <div className="flex flex-row items-center justify-center">
        <SidebarTrigger variant="ghost" size="icon-lg" className="m-1 p-4" />
      </div>
      <div className="m-4 flex">
        
      </div>
      <div className="flex flex-row items-center justify-center">
        
        <Button
          variant="ghost"
          size="icon-lg"
          className=""
          onClick={() => console.log('bot click')}
        >
          <ResolvedIcon name="User" className="" />
        </Button>
        <SettingsDropdownMenu />
        {children}
      </div>
    </header>
  );
};

export default Header;
