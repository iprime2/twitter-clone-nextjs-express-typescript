"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { BiImageAlt } from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import { GetServerSideProps } from "next";
import {
  getAllTweetsQuery,
  // getSignedURLForTweetQuery,
} from "@/graphql/query/tweet";
import axios from "axios";
import { toast } from "react-hot-toast";
import { graphClient } from "@/clients/api";
import TwitterLayout from "@/components/TwitterLayout/TwitterLayout";

import userAvatar from "../assets/userAvatar.png";

export default function Home() {
  const { tweets } = useGetAllTweets();
  const { user } = useCurrentUser();
  const { mutateAsync } = useCreateTweet();

  const [allTweets, setAllTweets] = useState<Tweet[]>([]);
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");

  // console.log(allTweets);

  // useEffect(() => {
  //   getAllTweets();
  // }, [user?.id]);

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
  }, [mutateAsync, content, imageURL]);

  // const getAllTweets = useCallback(async () => {
  //   ("use server");
  //   const allTweets = await graphClient.request(getAllTweetsQuery);

  //   if (!allTweets?.getAllTweets) toast.error("No tweet was found!!");

  //   setAllTweets(allTweets.getAllTweets as Tweet[]);
  // }, []);

  return (
    <div className="text-white">
      <TwitterLayout>
        <div>
          <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-1">
                {user?.profileImageURL && (
                  <Image
                    className="rounded-full"
                    src={
                      user?.profileImageURL ||
                      "https://avatars.githubusercontent.com/u/29702609?s=400&u=1d60fa042fd0abdd0a480e3622024e3cf04384cb&v=4"
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
                  <BiImageAlt onClick={handleSelectImage} className="text-xl" />
                  <button
                    onClick={handleCreateTweet}
                    className="bg-[#1d9bf0] font-semibold text-sm py-2 px-4 rounded-full"
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {tweets?.map((tweet: Tweet) =>
          tweet ? <FeedCard key={tweet?.id} tweet={tweet as Tweet} /> : null
        )}
      </TwitterLayout>
    </div>
  );
}
