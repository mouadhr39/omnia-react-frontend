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
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { ResolvedIcon, IconMap } from "@/lib/iconutils"
import { useState, useEffect } from "react"
import Config from "@/config/Sidebar.json"
import { GalleryVerticalEnd } from "lucide-react"
import Header from "@/components/Header"
import { NavLink, useLocation } from "react-router-dom"

interface SideBarHeaderProps {
  title: string
  version?: string
}

interface SideBarMainItemProps {
  title: string
  active?: boolean
  url: string
}

interface SideBarMainGroupProps {
  title: string
  url: string
  icon?: string
  active?: boolean
  items: Array<SideBarMainItemProps>
}

interface SideBarMainProps {
  title: string
  items: Array<SideBarMainGroupProps>
}

interface SideBarFooterProps {
  label: string
}
/***
 * Sidebar header section.
 */
const SideBarHeader: React.FC<SideBarHeaderProps> = ({
  title,
  version = "v1.0.0",
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
  )
}
/**
 *
 * @param item
 */
const SideBarMenuItem: React.FC<{
  title: string
  active?: boolean
  url: string
}> = ({ title, active, url }) => {
  const [openItem, setOpenItem] = useState(active || false)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.endsWith(url)) {
      setOpenItem(true)
    } else {
      setOpenItem(false)
    }
  })
  return (
    <SidebarMenuSubItem >
      <SidebarMenuSubButton 
        render={
          <NavLink
            key={url}
            to={url}
            className={
              openItem ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
            }
          />
        }
      >
        <span className={openItem ? "font-semibold" : ""}>{title}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}
/**
 *
 * @param group
 */
const SideBarMainGroup: React.FC<{
  title: string
  icon?: string
  active?: boolean
  url: string
  items: Array<SideBarMainItemProps>

}> = ({ title, icon, items, url, active }) => {
  const [openGroup, setOpenGroup] = useState(active || false)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith(url)) {
      setOpenGroup(true)
    } else {
      setOpenGroup(false)
    }
  })

  return (
    <Collapsible
      key={title}
      defaultOpen={openGroup}
      onOpenChange={setOpenGroup}
      render={<SidebarMenuItem />}
      className="group/collapsible"
    >
      <CollapsibleTrigger
        render={
          <SidebarMenuButton
            isActive={openGroup}
            tooltip={title}
            className={
              openGroup
                ? "bg-sidebar-accent text-sidebar-accent-foreground [&_*]:font-semibold"
                : ""
            }
          />
        }
      >
        {icon && IconMap[icon] && <ResolvedIcon name={icon} />}
        <span>{title}</span>

        <ResolvedIcon
          name="ChevronRight"
          className={
            "ml-auto transition-transform duration-200 group-data-[open]/collapsible:rotate-90"
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
  )
}
/***
 *
 * Sidebar main section.
 */
const SideBarMain: React.FC<SideBarMainProps> = (props) => {
  return (
    <SidebarGroup key={props.title}>
      <SidebarGroupLabel>{props.title}</SidebarGroupLabel>
      <SidebarMenu>
        {props.items.map((group) => (
          <SideBarMainGroup
            key={group.title}
            title={group.title}
            url={group.url}
            icon={group.icon}
            active={group.active}
            items={group.items}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

/**
 * Sidebar footer section
 *
 */
const SideBarFooter: React.FC<SideBarFooterProps> = ({ label }) => {
  return (
    <SidebarFooter>
      <div className="flex items-center justify-center gap-2 p-4">
        <span className="text-xs text-sidebar-foreground/70">{label}</span>
      </div>
    </SidebarFooter>
  )
}

const SideBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      {/* sidebar nav */}
      <Sidebar collapsible="icon">
        <SideBarHeader title="Omnia" version="1.0.0" />
        <SidebarContent>
          <SideBarMain title={Config.main.label} items={Config.main.items} />
        </SidebarContent>
        <SideBarFooter label={Config.footer.label} />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        {/* header nav */}
        <Header />

        {/* content */}

        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SideBar
