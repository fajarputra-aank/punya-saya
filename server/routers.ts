import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM, listLLMModels } from "./_core/llm";
import { transcribeAudio } from "./_core/voiceTranscription";
import { storageGetSignedUrl, storagePut } from "./storage";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createActionItem, createMeeting, deleteMeeting, getMeeting, listActionItems, listMeetings, updateActionItem, updateMeeting } from "./db";

const meetingStatus = z.enum(["scheduled", "processing", "completed", "archived"]);
const actionPriority = z.enum(["low", "medium", "high"]);
const actionStatus = z.enum(["todo", "in_progress", "done"]);

function parseModelContent(content: unknown) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map(part => typeof part === "object" && part && "text" in part ? String((part as { text?: unknown }).text ?? "") : "").join("\n");
  return "";
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  meetings: router({
    list: protectedProcedure.query(({ ctx }) => listMeetings(ctx.user.id)),
    get: protectedProcedure.input(z.object({ id: z.number().int().positive() })).query(({ ctx, input }) => getMeeting(ctx.user.id, input.id)),
    create: protectedProcedure.input(z.object({
      title: z.string().min(1).max(240),
      meetingDate: z.coerce.date().optional(),
      location: z.string().max(180).optional(),
      organizer: z.string().max(180).optional(),
      department: z.string().max(120).optional(),
      agenda: z.string().max(10000).optional(),
      attendees: z.array(z.string().max(180)).max(100).default([]),
    })).mutation(({ ctx, input }) => createMeeting({ ...input, ownerId: ctx.user.id, attendees: JSON.stringify(input.attendees), status: "scheduled" })),
    delete: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ ctx, input }) => deleteMeeting(ctx.user.id, input.id)),
    update: protectedProcedure.input(z.object({
      id: z.number().int().positive(),
      title: z.string().min(1).max(240).optional(),
      meetingDate: z.coerce.date().nullable().optional(),
      startedAt: z.coerce.date().nullable().optional(),
      endedAt: z.coerce.date().nullable().optional(),
      location: z.string().max(180).nullable().optional(),
      organizer: z.string().max(180).nullable().optional(),
      department: z.string().max(120).nullable().optional(),
      agenda: z.string().max(10000).nullable().optional(),
      attendees: z.array(z.string().max(180)).max(100).optional(),
      status: meetingStatus.optional(),
      audioUrl: z.string().url().nullable().optional(),
      transcript: z.string().max(200000).nullable().optional(),
      analysis: z.string().max(200000).nullable().optional(),
    })).mutation(({ ctx, input }) => {
      const { id, attendees, ...rest } = input;
      return updateMeeting(ctx.user.id, id, { ...rest, ...(attendees ? { attendees: JSON.stringify(attendees) } : {}) });
    }),
  }),
  actionItems: router({
    list: protectedProcedure.input(z.object({ meetingId: z.number().int().positive().optional() }).optional()).query(({ ctx, input }) => listActionItems(ctx.user.id, input?.meetingId)),
    create: protectedProcedure.input(z.object({ meetingId: z.number().int().positive(), task: z.string().min(1).max(5000), pic: z.string().max(180).optional(), deadline: z.string().max(80).optional(), priority: actionPriority.default("medium") })).mutation(({ ctx, input }) => createActionItem({ ...input, ownerId: ctx.user.id, status: "todo" })),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), task: z.string().min(1).max(5000).optional(), pic: z.string().max(180).nullable().optional(), deadline: z.string().max(80).nullable().optional(), priority: actionPriority.optional(), status: actionStatus.optional() })).mutation(({ ctx, input }) => { const { id, ...data } = input; return updateActionItem(ctx.user.id, id, data); }),
  }),
  audio: router({
    upload: protectedProcedure.input(z.object({ fileName: z.string().min(1).max(180), mimeType: z.string().max(100), data: z.string().min(1).max(24000000) })).mutation(async ({ ctx, input }) => {
      const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]+/g, "-");
      const bytes = Buffer.from(input.data, "base64");
      const stored = await storagePut(`audio/${ctx.user.id}/${Date.now()}-${safeName}`, bytes, input.mimeType || "audio/webm");
      const signedUrl = await storageGetSignedUrl(stored.key);
      return { ...stored, signedUrl };
    }),
  }),
  transcription: router({
    transcribe: protectedProcedure.input(z.object({ meetingId: z.number().int().positive(), audioUrl: z.string().url() })).mutation(async ({ ctx, input }) => {
      const meeting = await getMeeting(ctx.user.id, input.meetingId);
      if (!meeting) throw new Error("Rapat tidak ditemukan");
      const result = await transcribeAudio({ audioUrl: input.audioUrl, language: "id", prompt: "Transkripsikan percakapan rapat dalam Bahasa Indonesia. Pertahankan timestamp dan pergantian pembicara bila tersedia." });
      if ("error" in result) throw new Error(result.error);
      const transcriptPayload = JSON.stringify({ text: result.text, language: result.language, duration: result.duration, segments: result.segments ?? [] });
      await updateMeeting(ctx.user.id, input.meetingId, { audioUrl: input.audioUrl, transcript: transcriptPayload, status: "processing" });
      return { ...result, transcriptPayload };
    }),
  }),
  ai: router({
    analyze: protectedProcedure.input(z.object({ meetingId: z.number().int().positive(), transcript: z.string().min(1).max(200000) })).mutation(async ({ ctx, input }) => {
      const meeting = await getMeeting(ctx.user.id, input.meetingId);
      if (!meeting) throw new Error("Rapat tidak ditemukan");
      const modelCatalog = await listLLMModels();
      const model = modelCatalog.data.find(candidate => candidate.id.toLowerCase().includes("gemini"))?.id;
      const response = await invokeLLM({
        model,
        messages: [
          { role: "system", content: "Anda adalah sekretaris rapat profesional berbahasa Indonesia. Analisis hanya informasi yang benar-benar ada di transkrip. Jika informasi tidak tersedia, gunakan null atau 'Belum disebutkan'. Jangan mengarang nama, tenggat, atau keputusan." },
          { role: "user", content: `Susun analisis rapat terstruktur dari transkrip berikut.\n\n${input.transcript}` },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "meeting_analysis",
            strict: true,
            schema: {
              type: "object",
              properties: {
                summary: { type: "string" },
                key_points: { type: "array", items: { type: "string" } },
                decisions: { type: "array", items: { type: "string" } },
                problems: { type: "array", items: { type: "string" } },
                action_items: { type: "array", items: { type: "object", properties: { task: { type: "string" }, pic: { type: ["string", "null"] }, deadline: { type: ["string", "null"] }, priority: { type: "string", enum: ["low", "medium", "high"] }, status: { type: "string", enum: ["todo", "in_progress", "done"] } }, required: ["task", "pic", "deadline", "priority", "status"], additionalProperties: false } },
                follow_up: { type: "array", items: { type: "string" } },
                conclusion: { type: "string" },
              },
              required: ["summary", "key_points", "decisions", "problems", "action_items", "follow_up", "conclusion"],
              additionalProperties: false,
            },
          },
        },
      });
      const content = parseModelContent(response.choices?.[0]?.message?.content);
      if (!content) throw new Error("AI tidak mengembalikan analisis");
      const analysis = JSON.parse(content) as { summary: string; key_points: string[]; decisions: string[]; problems: string[]; action_items: Array<{ task: string; pic: string | null; deadline: string | null; priority: "low" | "medium" | "high"; status: "todo" | "in_progress" | "done" }>; follow_up: string[]; conclusion: string };
      await updateMeeting(ctx.user.id, input.meetingId, { transcript: input.transcript, analysis: JSON.stringify(analysis), status: "completed" });
      for (const item of analysis.action_items) await createActionItem({ ownerId: ctx.user.id, meetingId: input.meetingId, task: item.task, pic: item.pic ?? undefined, deadline: item.deadline ?? undefined, priority: item.priority, status: item.status });
      return analysis;
    }),
  }),
});

export type AppRouter = typeof appRouter;
