"use client";
import Image from "next/image";
import React from "react";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";

interface FeedCardButton {
  id: number;
  icon: React.ReactNode;
  color: string;
}

const FeedCardButton: FeedCardButton[] = [
  { id: 1, icon: BiMessageRounded, color: "text-blue-400" },
  { id: 2, icon: FaRetweet, color: "text-green-500" },
  { id: 3, icon: AiOutlineHeart, color: "text-red-400" },
];

const FeedCard: React.FC = () => {
  return (
    <div className="border border-l-0 border-r-0 border-gray-600 p-5 p-b-0 hover:bg-slate-900 transition-all cursor-pointer text-white">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-1 flex items-start justify-center">
          <Image
            className="object-cover rounded-full"
            src={"https://avatars.githubusercontent.com/u/29702609?v=4"}
            alt="Profile"
            width={100}
            height={100}
          />
        </div>
        <div className="col-span-11 mt-[-2px]">
          <pre>Sushil Gupta</pre>
          <p>
            A text written by ChatGPT can be detected in 10 seconds. But it is
            possible to fool the detectors. Here how you can pass the AI
            ​​detector test.
          </p>
          <div className="flex text-2xl text-gray-400 items-center justify-between mt-4 p-0 w-[94%]">
            <div className={" hover:text-blue-400"}>
              <BiMessageRounded />
            </div>
            <div className={" hover:text-green-500"}>
              <FaRetweet />
            </div>
            <div className={" hover:text-red-400"}>
              <AiOutlineHeart />
            </div>
            <div className={" hover:text-red-400"}>
              <BiUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
