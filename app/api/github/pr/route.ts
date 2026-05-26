import { octokit } from "@/lib/github";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const prUrl = req.nextUrl.searchParams.get("url");
  if (!prUrl) {
    return NextResponse.json({ message: "Missing PR URL" }, { status: 400 });
  }

  // Parse: https://github.com/owner/repo/pull/9
  const match = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) {
    return NextResponse.json({ message: "Invalid PR URL" }, { status: 400 });
  }

  const [, owner, repo, pull_number] = match;

  try {
    const res = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}",
      {
        owner,
        repo,
        pull_number: Number(pull_number),
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      },
    );
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Failed to load GitHub PR", error);
    return NextResponse.json(
      { message: "Failed to load GitHub PR" },
      { status: 500 },
    );
  }
};
