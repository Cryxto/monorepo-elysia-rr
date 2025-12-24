import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Link, useLocation } from "react-router";
import { type ReactNode } from "react";
import { pascalCase } from "text-case";

export const BreadcrumbWrapper = (props: { children: ReactNode }) => (
  <>{props.children}</>
);

export function SiteHeader() {
  const location = useLocation();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {/* <h1 className="text-base font-medium">Documents</h1> */}
        <Breadcrumb>
          <BreadcrumbList>
            {location.pathname
              .split("/")
              .filter((e) => e.trim() !== "")
              .map((path, index) => (
                <BreadcrumbWrapper key={path}>
                  {/* <h1>Test</h1> */}
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={`/${path}`}>{pascalCase(path, { delimiter: " " })}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {location.pathname.split("/").length === index + 1 && (
                    <BreadcrumbSeparator />
                  )}
                </BreadcrumbWrapper>
              ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            {/* <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a> */}

            <NavUser />
          </Button>
        </div>
      </div>
    </header>
  );
}
