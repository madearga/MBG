'use client';

import { api } from '@convex/_generated/api';
import {
  Building2,
  CheckSquare,
  FolderOpen,
  Home,
  LogIn,
  LogOut,
  Menu,
  Tags,
  TestTube2,
} from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { OrganizationSwitcher } from '@/components/organization/organization-switcher';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { signOut } from '@/lib/convex/auth-client';
import {
  useAuthAction,
  useCurrentUser,
  usePublicQuery,
} from '@/lib/convex/hooks';

// Top-level regex for performance
const SEGMENT_ID_PATTERN = /^[a-zA-Z0-9]+$/;

export function BreadcrumbNav() {
  const pathname = usePathname();
  const user = useCurrentUser();
  const generateSamplesAction = useAuthAction(api.seed.generateSamples);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if there's any data (projects)
  const { data: projectsData } = usePublicQuery(
    api.projects.list,
    { paginationOpts: { numItems: 1, cursor: null } },
    {
      placeholderData: { page: [], isDone: true, continueCursor: '' },
    }
  );
  const hasData = projectsData && projectsData.page.length > 0;

  // Parse the pathname into segments
  const segments = pathname.split('/').filter(Boolean);

  // Generate breadcrumb items
  const breadcrumbItems: React.ReactNode[] = [];

  // Always add home
  if (pathname === '/') {
    // On home page, show as current page
    breadcrumbItems.push(
      <BreadcrumbItem key="home">
        <BreadcrumbPage className="flex items-center gap-1">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </BreadcrumbPage>
      </BreadcrumbItem>
    );
  } else {
    // On other pages, show as link
    breadcrumbItems.push(
      <BreadcrumbItem key="home">
        <BreadcrumbLink asChild>
          <Link className="flex items-center gap-1" href="/">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
    );
  }

  // Add separator after home if there are segments
  if (segments.length > 0) {
    breadcrumbItems.push(<BreadcrumbSeparator key="home-separator" />);
  }

  // Add each segment
  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const href = `/${segments.slice(0, index + 1).join('/')}`;

    // Format segment name
    let displayName = segment;

    // Handle special cases
    if (segment === 'projects') {
      displayName = 'Projects';
    } else if (segment === 'tags') {
      displayName = 'Tags';
    } else if (segment === 'login') {
      displayName = 'Login';
    } else if (segment === 'register') {
      displayName = 'Register';
    }
    // For dynamic segments (like project IDs), you might want to fetch the actual name
    // For now, we'll just show "Detail" for ID-like segments
    else if (segment.match(SEGMENT_ID_PATTERN)) {
      displayName = 'Detail';
    }

    if (isLast) {
      breadcrumbItems.push(
        <BreadcrumbItem key={segment}>
          <BreadcrumbPage>{displayName}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    } else {
      breadcrumbItems.push(
        <BreadcrumbItem key={segment}>
          <BreadcrumbLink asChild>
            <Link href={href as Route}>{displayName}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
      breadcrumbItems.push(
        <BreadcrumbSeparator key={`${segment}-separator`} />
      );
    }
  });

  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Breadcrumbs */}
          <Breadcrumb className="hidden md:block">
            <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
          </Breadcrumb>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-4">
                  <Link
                    className="flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <CheckSquare className="h-4 w-4" />
                    Todos
                  </Link>
                  <Link
                    className="flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
                    href="/projects"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FolderOpen className="h-4 w-4" />
                    Projects
                  </Link>
                  <Link
                    className="flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
                    href="/tags"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Tags className="h-4 w-4" />
                    Tags
                  </Link>
                  {user?.activeOrganization?.slug && (
                    <Link
                      className="flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
                      href={`/org/${user.activeOrganization.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Building2 className="h-4 w-4" />
                      Organization
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Center - Quick Links */}
          <div className="hidden items-center gap-4 md:flex">
            <Link
              className="flex items-center gap-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
              href="/"
            >
              <CheckSquare className="h-4 w-4" />
              Todos
            </Link>
            <div className="h-4 w-px bg-border" />
            <Link
              className="flex items-center gap-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
              href="/projects"
            >
              <FolderOpen className="h-4 w-4" />
              Projects
            </Link>
            <div className="h-4 w-px bg-border" />
            <Link
              className="flex items-center gap-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
              href="/tags"
            >
              <Tags className="h-4 w-4" />
              Tags
            </Link>
            {user?.activeOrganization?.slug && (
              <>
                <div className="h-4 w-px bg-border" />
                <Link
                  className="flex items-center gap-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
                  href={`/org/${user.activeOrganization.slug}`}
                >
                  <Building2 className="h-4 w-4" />
                  Organization
                </Link>
              </>
            )}
          </div>

          {/* Right side - Organization Switcher & Auth */}
          <div className="flex items-center gap-2">
            {user?.id ? (
              <>
                <OrganizationSwitcher />
                {hasData ? null : (
                  <Button
                    disabled={generateSamplesAction.isPending}
                    onClick={() => {
                      toast.promise(
                        generateSamplesAction.mutateAsync({ count: 100 }),
                        {
                          loading: 'Generating sample projects with todos...',
                          success: (result) =>
                            `Created ${result.created} projects with ${result.todosCreated} todos!`,
                          error: (e) =>
                            e.data?.message ?? 'Failed to generate samples',
                        }
                      );
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <TestTube2 className="h-4 w-4" />
                    Add Samples
                  </Button>
                )}
                <Button onClick={() => signOut()} size="sm" variant="outline">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="outline">
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
