"use server";
import { PrismaClient } from "../../generated/prisma";
import { google } from "googleapis";

const TWELVE_HOURS_IN_MS = 1000 * 60 * 60 * 12;

// TODO: use zod to indirectly get process.env vars
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

// TODO: Move this(and any db interactions) into its own file
const prisma = new PrismaClient();

oauth2Client.on("tokens", (tokens) => {
  if (tokens.refresh_token) {
    // store the refresh_token in database!
    prisma.refreshToken.upsert({
      where: { source: "google" },
      update: {
        refreshToken: tokens.refresh_token,
      },
      create: {
        source: "google",
        refreshToken: tokens.refresh_token,
      },
    });
  }
});

export const authorizeApi = async () => {
  // TODO: add tasks scope
  const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    scope: SCOPES,
  });
  return url;
};

export const setToken = async (code: string | null) => {
  // will need to make some sort of log out
  const token = await prisma.refreshToken.findUnique({
    where: { source: "google" },
  });
  if (token?.refreshToken || !code) {
    // figure out why we have to do this again
    // https://github.com/googleapis/google-api-nodejs-client?tab=readme-ov-file#handling-refresh-tokens
    oauth2Client.setCredentials({
      access_token: token?.accessToken,
      refresh_token: token?.refreshToken,
    });
    return null;
  }
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  await prisma.refreshToken.upsert({
    where: { source: "google" },
    update: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    },
    create: {
      source: "google",
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    },
  });
};

const API_KEY = process.env.GOOGLE_API_KEY;
const calendarApi = google.calendar({
  key: API_KEY,
  // this is actually needed
  auth: oauth2Client,
  version: "v3",
});

export const hasToken = async () => {
  return (await prisma.refreshToken.findUnique({ where: { source: "google" } }))
    ?.refreshToken;
};

const getCalendars = async () => {
  return calendarApi.calendarList.list();
};

export const getCalendarEvents = async (code: string | null) => {
  try {
    await setToken(code);
    const cals = await getCalendars();
    // for timemax of tomorrow, timeMin of now
    const timeMax = new Date(Date.now() + TWELVE_HOURS_IN_MS).toISOString();
    const timeMin = new Date().toISOString();
    const eventRequests = (cals?.data?.items || []).map((cal) => {
      return cal.id
        ? calendarApi.events.list({ calendarId: cal.id, timeMax, timeMin })
        : Promise.resolve({ data: { items: [] } });
    });
    const eventsByCal = await Promise.all(eventRequests);
    return eventsByCal.flatMap((cal) => {
      return cal.data.items || [];
    });
  } catch (e) {
    // this is a way to see the error response with a pretty link
    // figure out how to take special google response type
    if (e instanceof Error && 'response' in e) {
      console.log(e.response);
    }
  }
};
