"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils"
import { Category } from "@/types";

interface MainNavProps {
  data: Category[];
}

const MainNav: React.FC<MainNavProps> = ({
  data
}) => {
  const pathname = usePathname();

  const routes = data.map((route) => ({
    href: `/category/${route.name.toLowerCase()}`,
    label: route.name,
    categoryId: route.id,
    active: pathname === `/category/${route.name.toLowerCase()}`,
  }));

  return (
    <nav
      className="mx-6 flex items-center space-x-4 lg:space-x-6 capitalize"
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          data-category-id={route.categoryId}
          className={cn(
            'text-sm font-medium transition-colors duration-300  hover:bg-primary-lightest/60 hover:text-white px-3 py-1 rounded-md',
            route.active ? 'text-primary-lighter' : 'text-white'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
};

export default MainNav;
