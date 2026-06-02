import { Inngest } from "inngest";

type ResumeParseEvent = {
  data: {
    resumeId: string;
    userId: string;
    filePath: string;
  };
};

type Events = {
  "resume/parse": ResumeParseEvent;
};

// Create a client to send and receive events
export const inngest = new Inngest({ id: "applyflow-ai" });
