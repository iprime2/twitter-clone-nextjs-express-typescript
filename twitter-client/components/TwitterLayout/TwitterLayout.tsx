"use client";
import { useCurrentUser } from "@/hooks/user";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { verifyGoogleTokenQuery } from "@/graphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { graphClient } from "@/clients/api";
import { User } from "@/gql/graphql";

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}

interface TwitterLayoutProps {
  children: React.ReactNode;
}

const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sidebarMenuItems: TwitterSidebarButton[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <BiHomeCircle />,
        link: "/",
      },
      {
        title: "Explore",
        icon: <BiHash />,
        link: "/",
      },
      {
        title: "Notifications",
        icon: <BsBell />,
        link: "/",
      },
      {
        title: "Messages",
        icon: <BsEnvelope />,
        link: "/",
      },
      {
        title: "Bookmarks",
        icon: <BsBookmark />,
        link: "/",
      },
      {
        title: "Twitter Blue",
        icon: <BiMoney />,
        link: "/",
      },
      {
        title: "Profile",
        icon: <BiUser />,
        link: `/${user?.id}`,
      },
      {
        title: "More Options",
        icon: <SlOptions />,
        link: "/",
      },
    ],
    [user?.id]
  );

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error(`Google token not found`);

      //@ts-ignore
      const { verifyGoogleToken } = await graphClient.request(
        verifyGoogleTokenQuery,
        { token: googleToken }
      );

      toast.success("Verified Success");

      if (verifyGoogleToken)
        window.localStorage.setItem("__twitter_clone_token", verifyGoogleToken);

      //@ts-ignore
      await queryClient.invalidateQueries(["curent-user"]);

      window.location.reload();
    },
    [queryClient]
  );

  if (!isClient) {
    return null;
  }

  return (
    <div className="text-white">
      <div className="grid grid-cols-12 h-screen w-screen sm:px-46">
        <div className="col-span-2 sm:col-span-3 pt-1 flex sm:justify-end pr-4 relative">
          <div>
            <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
              <BsTwitter />
            </div>
            <div className="pr-4">
              <ul>
                {sidebarMenuItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      className="flex justify-start items-center xl:text-xl lg:gap-2 hover:bg-gray-800 rounded-full px-3 md:py-1 xl:py-2 w-fit cursor-pointer mt-2"
                      href={item.link}
                    >
                      <p>{item.icon}</p>
                      <p className="hidden sm:inline">{item.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 px-3">
                <button className="hidden sm:block bg-[#1d9bf0] font-semibold text-lg py-2 px-4 rounded-full w-full">
                  Tweet
                </button>
                <button className="block sm:hidden bg-[#1d9bf0] font-semibold text-lg py-2 px-4 rounded-full w-full">
                  <BsTwitter />
                </button>
              </div>
            </div>
          </div>
          {user && (
            <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full cursor-pointer">
              <Image
                className="rounded-full lg:w-[30px] lg:h-[30px]"
                src={user?.profileImageURL || "/userAvatar.png"}
                alt="user-image"
                height={50}
                width={50}
              />
              <div className="hidden sm:block">
                <h3 className="lg:text-md xl:text-xl">
                  {user.firstName} {user.lastName}
                </h3>
              </div>
            </div>
          )}
        </div>
        <div className="main-tweets col-span-10 sm:col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll border-gray-600">
          {props.children}
        </div>
        <div className="col-span-0 sm:col-span-3 p-5">
          {!user ? (
            <div className="p-5 bg-slate-700 rounded-lg">
              <h1 className="my-2 text-2xl">New to Twitter?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          ) : (
            <div className="px-4 py-3 bg-slate-800 rounded-lg">
              <h1 className="my-2 text-2xl mb-5">Users you may know</h1>
              {user?.recommendedUsers?.map((el: User) => (
                <div className="flex items-center gap-3 mt-2" key={el?.id}>
                  {el && (
                    <Image
                      src={el?.profileImageURL || "/userAvatar.png"}
                      alt="user-image"
                      className="rounded-full w-[40px] h-[40px] xl:w-[50px] xl:h-[50px] object-cover"
                      width={50}
                      height={50}
                    />
                  )}
                  <div>
                    <div className="text-sm xl:text-lg">
                      {el?.firstName} {el?.lastName}
                    </div>
                    <Link
                      href={`/${el?.id}`}
                      className="bg-white text-black text-sm px-5 py-1 w-full rounded-lg h-4ln 
                      acx "
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwitterLayout;
