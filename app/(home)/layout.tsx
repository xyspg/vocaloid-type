import Header from "@/app/components/Header";
import { LayoutGroup } from "motion/react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
       <LayoutGroup id="albums">
          <Header />
          {children}
        </LayoutGroup>
    </>
  );
}
