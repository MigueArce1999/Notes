import type { NextConfig } from "next";

const isPages=process.env.GITHUB_ACTIONS==='true';
const nextConfig: NextConfig = {
  output:'export',
  trailingSlash:true,
  images:{unoptimized:true},
  basePath:isPages?'/Notes':'',
  assetPrefix:isPages?'/Notes/':undefined,
  env:{NEXT_PUBLIC_BASE_PATH:isPages?'/Notes':''},
};

export default nextConfig;
