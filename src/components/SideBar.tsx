import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarGroupContent,
} from '@/components/ui/sidebar';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import { ResolvedIcon, IconMap } from '@/lib/iconutils';
import { useState } from 'react';
import Config from '@/config/Sidebar.json';
import { GalleryVerticalEnd } from 'lucide-react';
import Header from '@/components/Header';
import { NavLink, useLocation } from 'react-router-dom';

interface SideBarHeaderProps {
  title: string;
  version?: string;
}

interface SideBarSectionGroupProps {
  title: string;
  url: string;
  icon?: string;
  active?: boolean;
  items: Array<{
    title: string;
    active?: boolean;
    url: string;
  }>;
}

interface SideBarSectionItemProps {
  title: string;
  url: string;
  icon: string;
  active?: boolean;
}

interface SideBarSectionProps {
  label: string;
  level: number;
  items: Array<SideBarSectionGroupProps | SideBarSectionItemProps>;
}

interface SideBarFooterProps {
  label: string;
  children?: React.ReactNode;
}
/***
 * Sidebar header section.
 */
const SideBarHeader: React.FC<SideBarHeaderProps> = ({
  title,
  version = 'v1.0.0',
}) => {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium">{title}</span>
              <span className="font-small">{version}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
/**
 *
 * @param item
 */
const SideBarMenuItem: React.FC<{
  title: string;
  active?: boolean;
  url: string;
}> = ({ title, active, url }) => {
  const location = useLocation();
  const openItem = active || location.pathname.endsWith(url);
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        render={
          <NavLink
            key={url}
            to={url}
            className={`${openItem ? 'bg-sidebar-secondary text-sidebar-outline-foreground my-1' : ''}`}
          />
        }
      >
        {openItem ? (
          <svg
            xmlns="http://w3.org"
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-primary"
          >
            <circle cx="12" cy="12" r="4" />
          </svg>
        ) : null}
        <span className={openItem ? 'underlined font-semibold' : ''}>
          {title}
        </span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
};

const SideBarButtonItem: React.FC<{
  title: string;
  active?: boolean;
  url: string;
  icon: string;
}> = ({ title, active = false, url, icon }) => {
  const location = useLocation();
  const isActive = active || location.pathname.endsWith(url);
  return (
    <SidebarMenuButton
      isActive={isActive}
      render={
        <NavLink
          key={url}
          to={url}
          className={
            isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
          }
        />
      }
    >
      <ResolvedIcon name={icon} />
      <span>{title}</span>
    </SidebarMenuButton>
  );
};
/**
 *
 * @param group
 */
const SideBarGroup: React.FC<
  SideBarSectionGroupProps & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }
> = ({
  title,
  icon,
  items,
  open,
  onOpenChange,
}) => {
  return (
    <Collapsible
      key={title}
      open={open}
      onOpenChange={onOpenChange}
      render={<SidebarMenuItem />}
      className="group/collapsible"
    >
      <CollapsibleTrigger
        render={
          <SidebarMenuButton
            isActive={open}
            tooltip={title}
            className={
              open
                ? 'bg-sidebar-accent text-sidebar-accent-foreground [&_*]:font-semibold'
                : ''
            }
          />
        }
      >
        {icon && IconMap[icon] && <ResolvedIcon name={icon} />}
        <span>{title}</span>

        <ResolvedIcon
          name="ChevronRight"
          className={
            'ml-auto transition-transform duration-200 group-data-[open]/collapsible:rotate-90'
          }
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {items.map((item) => (
            <SideBarMenuItem
              key={item.title}
              title={item.title}
              active={item.active}
              url={item.url}
            />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
};

const SideBarSection: React.FC<SideBarSectionProps> = (props) => {
  const location = useLocation();
  const groups =
    props.level === 1
      ? []
      : (props.items as Array<SideBarSectionGroupProps>);
  const activeGroupUrl = groups.find((group) =>
    location.pathname.startsWith(group.url),
  )?.url;
  const [openGroupUrl, setOpenGroupUrl] = useState<string | undefined>(
    activeGroupUrl,
  );

  if (props.level === 1) {
    const items = props.items as Array<SideBarSectionItemProps>;
    return (
      <SidebarContent>
        <SidebarGroup key={props.label}>
          <SidebarGroupLabel>{props.label}</SidebarGroupLabel>
          <SidebarGroupContent className="flex-end">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SideBarButtonItem
                    title={item.title}
                    url={item.url}
                    active={item.active}
                    icon={item.icon}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    );
  }

  return (
    <SidebarContent>
      <SidebarGroup key={props.label}>
        <SidebarGroupLabel>{props.label}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {groups.map((group) => (
              <SideBarGroup
                key={group.title}
                title={group.title}
                url={group.url}
                icon={group.icon}
                active={group.active}
                items={group.items}
                open={openGroupUrl === group.url}
                onOpenChange={(open) =>
                  setOpenGroupUrl(open ? group.url : undefined)
                }
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

/**
 * Sidebar footer section
 *
 */
const SideBarFooter: React.FC<SideBarFooterProps> = ({ label, children }) => {
  return (
    <SidebarFooter>
      {children}
      <div className="flex items-center justify-center gap-2 p-4">
        <span className="text-xs text-sidebar-foreground/70">{label}</span>
      </div>
    </SidebarFooter>
  );
};

const SideBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <SidebarProvider>
      {/* sidebar nav */}
      <Sidebar collapsible="icon">
        <SideBarHeader title="Omnia" version="1.0.0" />
        {Config.sections.map((section) => (
          <SideBarSection
            key={`${section.label}-${location.pathname}`}
            label={section.label}
            level={section.level}
            items={section.items}
          />
        ))}
        <SideBarFooter label={Config.footer.label}>
          {Config.footer.sections.map((section) => (
            <SideBarSection
              key={`${section.label}-${location.pathname}`}
              label={section.label}
              level={section.level}
              items={section.items}
            />
          ))}
        </SideBarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        {/* header nav */}
        <Header />
        {/* content */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SideBar;
