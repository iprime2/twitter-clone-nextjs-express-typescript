"use client";
import React, { useCallback, useState } from "react";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import {
  BiHash,
  BiHomeCircle,
  BiImageAlt,
  BiMoney,
  BiSolidImageAlt,
  BiUser,
} from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import FeedCard from "@/components/FeedCard";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { GraphQLClient } from "graphql-request";
import { verifyGoogleTokenQuery } from "@/graphql/query/user";
import { graphClient } from "@/clients/api";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";

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
  const queryClient = useQueryClient();

  const { user } = useCurrentUser();
  const { tweets } = useGetAllTweets();
  const { mutateAsync } = useCreateTweet();

  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      try {
        const googleToken = cred.credential;
        console.log(googleToken);

        if (!googleToken) toast.error("Google Token Not found");
        const data = await graphClient.request(verifyGoogleTokenQuery, {
          token: googleToken,
        });
        toast.success("verified");
        // const { verifyGoogleToken } = data;

        if (data?.verifyGoogleToken) {
          window.localStorage.setItem(
            "__twitter_clone_token",
            data?.verifyGoogleToken
          );
        }

        await queryClient.invalidateQueries(["current-user"]);
      } catch (error) {
        console.log(error);
      }
    },
    [queryClient]
  );

  const handleLoginError = () => {
    toast.error("Something went wrong, please try again");
  };

  const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if (!file) return;

      // const { getSignedURLForTweet } = await graphClient.request(
      //   getSignedURLForTweetQuery,
      //   {
      //     imageName: file.name,
      //     imageType: file.type,
      //   }
      // );

      // if (getSignedURLForTweet) {
      //   toast.loading("Uploading...", { id: "2" });
      //   await axios.put(getSignedURLForTweet, file, {
      //     headers: {
      //       "Content-Type": file.type,
      //     },
      //   });
      //   toast.success("Upload Completed", { id: "2" });
      //   const url = new URL(getSignedURLForTweet);
      //   const myFilePath = `${url.origin}${url.pathname}`;
      //   setImageURL(myFilePath);
      // }
    };
  }, []);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    const handlerFn = handleInputChangeFile(input);

    input.addEventListener("change", handlerFn);

    input.click();
  }, [handleInputChangeFile]);

  const handleCreateTweet = useCallback(async () => {
    await mutateAsync({
      content,
      imageUrl: imageURL,
    });
    setContent("");
    setImageURL("");
  }, [content, imageURL]);

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen pl-32 text-white">
        <div className="col-span-2 flex flex-col justify-start pt-1 relative">
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
              <button className="text-lg bg-[#1d9bf0] px-4 rounded-full w-full items-center justify-center">
                Tweet
              </button>
            </div>
          </div>
          {user && (
            <div className="absolute bottom-5 flex gap-2 text-white rounded-full bg-slate-800 py-3 px-2 mr-2">
              <Image
                className="rounded-full"
                src={
                  user?.profileImageUrl ||
                  "https://avatars.githubusercontent.com/u/29702609?v=4"
                }
                alt="profile"
                width={50}
                height={50}
              />
              <div className="flex items-center justify-center">
                <h3 className="lg:text-xl md:text-sm text-xs">
                  {user?.firstName} {user?.lastName}
                </h3>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-6 p-0 border-t-0 border border-b-0 h-screen overflow-x-scroll border-gray-400">
          <div>
            <div className="grid grid-cols-12 gap-3 mt-2 ay-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
              <div className="col-span-1">
                {user && (
                  <Image
                    className="rounded-full"
                    src={
                      user?.profileImageURL ||
                      "https://avatars.githubusercontent.com/u/29702609?v=4"
                    }
                    alt="user-image"
                    height={50}
                    width={50}
                  />
                )}
              </div>
              <div className="col-span-11">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent text-xl px-3 border-b border-slate-700"
                  placeholder="What's happening?"
                  rows={3}
                ></textarea>
                {imageURL && (
                  <Image
                    src={imageURL}
                    alt="tweet-image"
                    width={300}
                    height={300}
                  />
                )}
                <div className="mt-2 flex justify-between items-center">
                  <BiSolidImageAlt
                    onClick={handleSelectImage}
                    className="text-xl"
                  />
                  <button
                    onClick={handleCreateTweet}
                    className="bg-[#1d9bf0] font-semibold cursor-pointer text-sm py-2 px-4 rounded-full"
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>
          {tweets?.map((tweet: Tweet) =>
            tweet ? <FeedCard key={tweet?.id} tweet={tweet} /> : null
          )}
        </div>
        <div className="col-span-3">
          {!user && (
            <div className="p-5 bg-slate-300 rounded-lg mt-5 gap-4">
              <h1 className="text-2xl">New to Twitter</h1>
              <GoogleLogin
                onSuccess={handleLoginWithGoogle}
                onError={handleLoginError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
