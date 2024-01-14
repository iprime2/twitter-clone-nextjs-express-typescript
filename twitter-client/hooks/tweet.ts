import { CreateTweetInput } from "./../gql/graphql";
import { graphClient } from "@/clients/api";
import { createTweetMutation } from "@/graphql/mutation/tweet";
import { getAllTweetsQuery } from "@/graphql/query/tweet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useCreateTweet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateTweetInput) =>
      graphClient.request(createTweetMutation, { payload }),
    onMutate: (payload) => toast.loading("Creating Tweet", { id: "1" }),
    onSuccess: async (payload) => {
      //@ts-ignore
      await queryClient.invalidateQueries(["all-tweets"]);
      toast.success("Created Success", { id: "1" });
    },
  });

  return mutation;
};

export const useGetAllTweets = () => {
  const query = useQuery({
    queryKey: ["all-tweets"],
    queryFn: () => graphClient.request(getAllTweetsQuery),
  });

  //@ts-ignore
  return { ...query, tweets: query.data?.getAllTweets };
};
