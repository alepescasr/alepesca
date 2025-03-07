"use client";

import { Menu, X } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { Category } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  data: Category[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  data
}) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const routes = data.map((route) => ({
    href: `/category/${route.id}`,
    label: route.name,
    active: pathname === `/category/${route.id}`,
  }));

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <>
      <button
        onClick={onOpen}
        className="flex items-center lg:hidden"
      >
        <Menu size={24} />
      </button>

      <Dialog 
        open={open} 
        as="div" 
        className="relative z-40 lg:hidden" 
        onClose={onClose}
      >
        {/* Fondo oscuro */}
        <div className="fixed inset-0 bg-black bg-opacity-25" />

        {/* Panel del menú */}
        <div className="fixed inset-0 z-40 flex">
          <Dialog.Panel className="relative mr-auto flex h-[70vh] w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl rounded-tr-3xl rounded-br-3xl">
            <div className="flex items-center justify-between px-4 py-4">
              <h2 className="text-lg font-medium">Categorías</h2>
              <button
                type="button"
                className="rounded-full p-2 text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            </div>

            {/* Lista de categorías */}
            <div className="mt-4 space-y-4 px-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    'block text-sm font-medium transition-colors hover:text-black rounded-r-full px-4 py-2',
                    route.active ? 'text-black bg-neutral-100' : 'text-neutral-500'
                  )}
                  onClick={onClose}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default MobileMenu; 