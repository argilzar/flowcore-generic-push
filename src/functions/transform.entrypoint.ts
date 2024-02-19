// -----------------------------------------------------------------------------
// Purpose: Transform entrypoint
// this is the entrypoint that will be called when the transformer is invoked
// to transform an event, the return value of this function will be passed to
// the read model adapter.
// -----------------------------------------------------------------------------

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import * as process from "process";

interface Input<T = any> {
  eventId: string;
  validTime: string;
  payload: T;
}

const pushName = process.env.PUSH_NAME || undefined;
const webhookUrl = process.env.WEBHOOK_URL || "";
const authType = process.env.AUTH_TYPE || "";
const authHeader = process.env.AUTH_HEADER || "";
const authUsername = process.env.AUTH_USERNAME || "";
const authPassword = process.env.AUTH_PASSWORD || "";

interface WebhookResponse {
  status: number;
  statusText: string;
  timestamp?: string;
  source_eventId?: string;
  pushName?: string;
}

export default async function (input: Input) {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    switch (authType) {
    case "basic":
      config.headers.Authorization = `Basic ${Buffer.from(
        `${authUsername}:${authPassword}`,
      ).toString("base64")}`;
      break;
    case "static-auth-header":
      config.headers.Authorization = authHeader;
      break;
    }

    const response: AxiosResponse = await axios.post(
      webhookUrl,
      input.payload,
      config,
    );

    // Constructing the response object
    const webhookResponse: WebhookResponse = {
      status: response.status,
      statusText: response.statusText,
      source_eventId: input.eventId,
      timestamp: new Date().toISOString(),
      pushName,
    };
    return webhookResponse;
  } catch (error) {
    return {
      status: error.response?.status || 500,
      statusText: error.response?.statusText || "Internal Server Error",
      source_eventId: input.eventId,
      timestamp: new Date().toISOString(),
      pushName,
    } as WebhookResponse;
  }
}
