"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import type { NextPage } from "next";
import { BsArrowLeftShort } from "react-icons/bs";
import { useCurrentUser } from "@/hooks/user";
import FeedCard from "@/components/FeedCard";
import { Tweet, User } from "@/gql/graphql";
import { graphClient } from "@/clients/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  followUserMutation,
  unfollowUserMutation,
} from "@/graphql/mutation/user";
import { useQueryClient } from "@tanstack/react-query";
import TwitterLayout from "@/components/TwitterLayout/TwitterLayout";
import { getUserByIdQuery } from "@/graphql/query/user";
import toast from "react-hot-toast";

const UserProfilePage: NextPage = () => {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [userInfo, setUserInfo] = useState<User>();
  const params = useParams();

  const amIFollowing = useMemo(() => {
    if (!userInfo) return false;
    return (
      (currentUser?.following?.findIndex(
        (el: User) => el?.id === userInfo?.id
      ) ?? -1) >= 0
    );
  }, [currentUser?.following, userInfo]);

  const handleFollowUser = useCallback(async () => {
    if (!userInfo?.id) return;

    await graphClient.request(followUserMutation, { to: userInfo?.id });
    //@ts-ignore
    await queryClient.invalidateQueries(["current-user"]);
    router.refresh();
  }, [userInfo?.id, queryClient]);

  const handleUnfollowUser = useCallback(async () => {
    if (!userInfo?.id) return;

    await graphClient.request(unfollowUserMutation, {
      to: userInfo?.id,
    });
    //@ts-ignore
    await queryClient.invalidateQueries(["current-user"]);
    router.refresh();
  }, [userInfo?.id, queryClient]);

  useEffect(() => {
    getUserInfo();
  }, [currentUser?.id]);

  const getUserInfo = useCallback(async () => {
    // const id = currentUser?.id as string | undefined;
    const id = params.id as string | undefined;

    ("use server");
    if (!id) toast.error("User not found");

    const userInfo = await graphClient.request(getUserByIdQuery, { id });

    //@ts-ignore
    if (!userInfo?.getUserById) toast.error("User not found");
    // const userInfo = userInfo.getUserById as User;

    //@ts-ignore
    setUserInfo(userInfo.getUserById as User);
  }, [currentUser?.id]);

  return (
    <div>
      <TwitterLayout>
        <div>
          <nav className="flex items-center gap-3 py-3 px-3 ">
            <BsArrowLeftShort className="text-4xl" />
            <div>
              <h1 className="text-2xl font-bold">
                {userInfo?.firstName} {userInfo?.lastName}
              </h1>
              <h1 className="text-md font-bold text-slate-500">
                {userInfo?.tweets?.length} Tweets
              </h1>
            </div>
          </nav>
          <div className="p-4 border-b border-slate-800">
            {userInfo && (
              <Image
                src={userInfo?.profileImageURL || "/userAvatar.png"}
                alt="user-image"
                className="rounded-full"
                width={100}
                height={100}
              />
            )}
            <h1 className="text-2xl font-bold mt-5">
              {userInfo?.firstName} {userInfo?.lastName}
            </h1>
            <div className="flex justify-between items-center">
              <div className="flex gap-4 mt-2 text-sm text-gray-400">
                <span>
                  {userInfo && userInfo?.followers?.length + " followers"}
                </span>
                <span>
                  {userInfo && userInfo?.following?.length + " following"}
                </span>
              </div>
              {currentUser?.id !== userInfo?.id && (
                <>
                  {amIFollowing ? (
                    <button
                      onClick={handleUnfollowUser}
                      className="bg-sky-500 hover:bg-sky-800 text-white font-semibold px-3 py-1 rounded-full text-sm"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={handleFollowUser}
                      className="bg-sky-500 hover:bg-sky-800 text-white font-semibold px-3 py-1 rounded-full text-sm"
                    >
                      Follow
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            {userInfo?.tweets?.map((tweet) => (
              <FeedCard tweet={tweet as Tweet} key={tweet?.id} />
            ))}
          </div>
        </div>
      </TwitterLayout>
    </div>
  );
};

export default UserProfilePage;
