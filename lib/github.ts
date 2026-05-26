import { Octokit } from "@octokit/core";

const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;
if (!githubAccessToken) {
  throw new Error("Missing GITHUB_ACCESS_TOKEN environment variable");
}

export const octokit = new Octokit({
  auth: githubAccessToken,
});
