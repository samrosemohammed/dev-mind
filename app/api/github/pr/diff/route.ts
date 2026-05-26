import { octokit } from "@/lib/github";
import { NextRequest, NextResponse } from "next/server";
import { GetResponseTypeFromEndpointMethod, Endpoints } from "@octokit/types";

export const GET = async (req: NextRequest) => {
  const prUrl = req.nextUrl.searchParams.get("url");
  if (!prUrl) {
    return NextResponse.json({ message: "Missing PR URL" }, { status: 400 });
  }
  const match = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) {
    return NextResponse.json({ message: "Invalid PR URL" }, { status: 400 });
  }
  const [, owner, repo, prNumber] = match;
  const { data: files } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    {
      owner,
      repo,
      pull_number: Number(prNumber),
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
    },
  );
  return NextResponse.json(files);
};
