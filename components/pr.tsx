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
import { usePRContext } from "@/context/provider";
import { useRouter } from "next/navigation";

export const PR = () => {
  const { setSubmittedUrl } = usePRContext();
  const router = useRouter();
  const form = useForm({
    defaultValues: { prUrl: "" },
    validators: { onSubmit: PRSchema },
    onSubmit: async ({ value }) => {
      setSubmittedUrl(value.prUrl); // triggers queries in context
      router.push("/pr"); // navigate to PR page to view results
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
