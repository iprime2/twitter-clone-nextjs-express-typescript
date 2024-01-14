/** @type {import('next').NextConfig} */
const nextConfig = {
  ignoreTypeScriptErrors: true,
  ignoreBuildErrors: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "sushil-twitter-clone-dev.s3.api-south-1.amazonaws.com",
      "encrypted-tbn0.gstatic.com",
      "as2.ftcdn.net",
      "media.istockphoto.com",
    ],
  },
};

module.exports = nextConfig;
