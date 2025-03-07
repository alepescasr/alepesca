import Link from "next/link";
import { Menu } from "lucide-react";

import MainNav from "@/components/main-nav";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import getCategories from "@/actions/get-categories";
import MobileMenu from "@/components/mobile-menu";

const Navbar = async () => {
  const categories = await getCategories();

  return ( 
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <div className="flex items-center lg:hidden">
            <MobileMenu data={categories} />
          </div>
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl">STORE</p>
          </Link>
          <div className="hidden lg:block">
            <MainNav data={categories} />
          </div>
          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};
 
export default Navbar;
