"use client";
import React, { useCallback } from "react";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import FeedCard from "@/components/FeedCard";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { GraphQLClient } from "graphql-request";
import { verifyGoogleTokenQuery } from "@/graphql/query/user";
import { graphClient } from "@/clients/api";

interface TwitterSideBarButton {
  title: string;
  icon: React.ReactNode;
}

const sidebarMenuItems: TwitterSideBarButton[] = [
  {
    title: "Home",
    icon: <BiHomeCircle />,
  },
  {
    title: "Explore",
    icon: <BiHash />,
  },
  {
    title: "Notifications",
    icon: <BsBell />,
  },
  {
    title: "Messages",
    icon: <BsEnvelope />,
  },
  {
    title: "Bookmarks",
    icon: <BsBookmark />,
  },
  {
    title: "Twitter Blue",
    icon: <BiMoney />,
  },
  {
    title: "Profile",
    icon: <BiUser />,
  },
  {
    title: "More",
    icon: <SlOptions />,
  },
];

export default function Home() {
  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      try {
        const googleToken = cred.credential;
        if (!googleToken) toast.error("Google Token Not found");
        const data = await graphClient.request(verifyGoogleTokenQuery, {
          token: googleToken,
        });
        toast.success("verified");
        // const { verifyGoogleToken } = data;
        console.log(data);

        if (data?.verifyGoogleToken) {
          window.localStorage.setItem(
            "__twitter_clone_token",
            data?.verifyGoogleToken
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen pl-32">
        <div className="col-span-2 flex flex-col justify-start pt-1">
          <div className="h-fit w-fit text-4xl text-blue-400 cursor-pointer transition-all hover:bg-gray-400 rounded-full p-2 ml-2">
            <BsTwitter />
          </div>
          <div className="mt-3 text-white font-bold pr-4">
            <ul className="flex flex-col items-start justify-center gap-2">
              {sidebarMenuItems.map((item) => (
                <li
                  key={item.title}
                  className="flex items-center justify-start gap-4 hover:bg-gray-400 rounded-full px-5 hover:transition-all py-2 cursor-pointer w-fit"
                >
                  <span className="text-2xl">{item.icon}</span>{" "}
                  <span className="flex items-center justify-center text-xl font-medium ">
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 w-full items-center justify-center">
              <button className="text-lg bg-[#1d9bf0] p-4 rounded-full w-full items-center justify-center">
                Tweet
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-6 border-t-0 border border-b-0 h-screen overflow-x-scroll border-gray-400">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3">
          <div className="p-5 bg-slate-300 rounded-lg mt-5 gap-4">
            <h1 className="text-2xl">New to Twitter</h1>
            <GoogleLogin
              onSuccess={handleLoginWithGoogle}
              onError={(err: any) => console.log(err)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
