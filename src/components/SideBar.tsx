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
  useSidebar,
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ResolvedIcon, IconMap } from '@/lib/iconutils';
import { useState } from 'react';
import Config from '@/config/Sidebar.json';
import { GalleryVerticalEnd } from 'lucide-react';
import Header from '@/components/Header';
import { NavLink, useLocation } from 'react-router-dom';

const SS_SIDEBAR_STATE: string = 'sidebar::state';

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
  className?: string;
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
  const { state } = useSidebar();
  sessionStorage.setItem(SS_SIDEBAR_STATE, state);

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="default">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <GalleryVerticalEnd className="size-1" />
            </div>
            <div className="flex flex-row gap-1 leading-none">
              <span className="font-larger">{title}</span>
              <span className="font-small">v.{version}</span>
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

const SideBarDropDownItem: React.FC<{
  title: string;
  active?: boolean;
  url: string;
}> = ({ title, active, url }) => {
  const location = useLocation();
  const openItem = active || location.pathname.endsWith(url);

  return (
    <DropdownMenuItem
      key={title}
      render={
        <NavLink
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
    </DropdownMenuItem>
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
> = ({ title, icon, items, open, onOpenChange }) => {
  const { isMobile, state } = useSidebar();
  const isCollapsed = state === 'collapsed' && !isMobile;
  const triggerClassName = open
    ? 'bg-sidebar-accent text-sidebar-accent-foreground [&_*]:font-semibold'
    : '';

  if (isCollapsed) {
    return (
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                isActive={open}
                aria-label={title}
                className={triggerClassName}
              />
            }
          >
            {icon && IconMap[icon] && <ResolvedIcon name={icon} />}
            <span>{title}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" sideOffset={8}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>{title}</DropdownMenuLabel>
              {items.map((item) => (
                <SideBarDropDownItem
                  title={item.title}
                  active={item.active}
                  url={item.url}
                />
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  }

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
            className={triggerClassName}
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
    props.level === 1 ? [] : (props.items as Array<SideBarSectionGroupProps>);
  const activeGroupUrl = groups.find((group) =>
    location.pathname.startsWith(group.url)
  )?.url;
  const [openGroupUrl, setOpenGroupUrl] = useState<string | undefined>(
    activeGroupUrl
  );

  if (props.level === 1) {
    const items = props.items as Array<SideBarSectionItemProps>;
    return (
      <SidebarContent className={props.className}>
        <SidebarGroup key={props.label} className="p-0">
          {props.label !== '' ? (
            <SidebarGroupLabel>{props.label}</SidebarGroupLabel>
          ) : null}
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
    <SidebarContent className={props.className}>
      <SidebarGroup key={props.label}>
        {props.label !== '' ? (
          <SidebarGroupLabel>{props.label}</SidebarGroupLabel>
        ) : null}
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
  const state = sessionStorage.getItem(SS_SIDEBAR_STATE);

  return (
    <SidebarProvider defaultOpen={state === 'expanded' ? true : false}>
      <Sidebar
        className="flex justify-items-stretch border-none"
        collapsible="icon"
      >
        <SideBarHeader title="Omnia" version="1.0.0" />

        {Config.sections.map((section) => (
          <SideBarSection
            key={`${section.label}-${location.pathname}`}
            label={section.label}
            level={section.level}
            items={section.items}
            className="mt-10"
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
      <SidebarInset className="bg-sidebar">
        <Header />
        <div className="flex min-h-0 flex-1 flex-col rounded-tl-[1rem] border-t border-l border-sidebar-border bg-background">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SideBar;
