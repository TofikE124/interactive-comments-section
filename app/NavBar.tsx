"use client";

import { Avatar, Button, DropdownMenu } from "@radix-ui/themes";
import { signIn, signOut, useSession } from "next-auth/react";
import Skeleton from "./components/Skeleton";

const NavBar = () => {
  const { data, status } = useSession();

  if (status === "loading") {
    return (
      <header className="flex justify-end">
        <Skeleton width={40} height={20} />
      </header>
    );
  }

  return (
    <header className="flex justify-end">
      {data?.user && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Avatar
              src={data.user.image || "https://i.stack.imgur.com/34AD2.jpg"}
              alt="avatar"
              fallback="?"
              radius="full"
              className="cursor-pointer"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>{data.user.email}</DropdownMenu.Item>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{ background: "var(--Moderate-Blue)", cursor: "pointer" }}
            >
              Logout
            </Button>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}

      {!data?.user && <button onClick={() => signIn("google")}>Login</button>}
    </header>
  );
};

export default NavBar;
