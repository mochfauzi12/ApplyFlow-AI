import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { parseResumeJob } from "@/inngest/functions/parseResume";
import { autofillFormJob } from "@/inngest/functions/autofillForm";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    parseResumeJob,
    autofillFormJob
  ],
});
