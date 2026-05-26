import type { Endpoints } from "@octokit/types";

export type PRFiles =
  Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"]["response"]["data"];
export type PRFile = PRFiles[number];
