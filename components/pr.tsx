"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useForm } from "@tanstack/react-form";
import { PRSchema } from "@/schemas/pr";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PRFile } from "@/types/github";

const fetchPR = async (prUrl: string) => {
  const res = await fetch(`/api/github/pr?url=${encodeURIComponent(prUrl)}`);
  if (!res.ok) throw new Error("Failed to fetch PR");
  return res.json();
};

export const PR = () => {
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pr", submittedUrl],
    queryFn: () => fetchPR(submittedUrl!),
    enabled: !!submittedUrl, // only runs when submittedUrl is set
  });

  const { data: files } = useQuery({
    queryKey: ["pr-diff", submittedUrl],
    queryFn: () =>
      fetch(
        `/api/github/pr/diff?url=${encodeURIComponent(submittedUrl!)}`,
      ).then((r) => r.json()),
    enabled: !!submittedUrl,
  });

  // Add a reviewQuery that fires after files are loaded
  const { data: reviewData, isLoading: isReviewing } = useQuery({
    queryKey: ["pr-review", submittedUrl],
    queryFn: async () => {
      const res = await fetch("/api/github/pr/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }), // files from your diff query
      });
      return res.json();
    },
    enabled: !!files && files.length > 0, // only runs after diff loads
  });

  console.log("Review:", reviewData?.review);

  // Each file's patch is what you'll send to Claude
  console.log(
    files?.map((f: PRFile) => ({ file: f.filename, patch: f.patch })),
  );

  const form = useForm({
    defaultValues: {
      prUrl: "",
    },
    validators: {
      onSubmit: PRSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmittedUrl(value.prUrl); // this triggers the query
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Github PR URL</CardTitle>
        <CardDescription>
          Please enter the URL of the Github PR you want to analyze.
        </CardDescription>
        <CardContent>
          <form
            id="github-pr-url"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="prUrl"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>PR URL</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="https://github.com/owner/repo/pull/1"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
          {isLoading && <p>Loading PR...</p>}
          {isError && <p>Error: {error.message}</p>}
          {/* {data && (
            <pre className="text-xs p-4 overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          )} */}

          {isReviewing && (
            <p className="text-sm text-muted-foreground">
              Claude is reviewing...
            </p>
          )}
          {reviewData?.review && (
            <div className="mt-4 p-4 rounded-lg border text-sm whitespace-pre-wrap">
              {reviewData.review}
            </div>
          )}
        </CardContent>
      </CardHeader>
      <CardFooter>
        <Field orientation={"horizontal"}>
          <Button
            type="button"
            variant={"outline"}
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button type="submit" form="github-pr-url">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
