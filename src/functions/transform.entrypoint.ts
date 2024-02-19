// -----------------------------------------------------------------------------
// Purpose: Transform entrypoint
// this is the entrypoint that will be called when the transformer is invoked
// to transform an event, the return value of this function will be passed to
// the read model adapter.
// -----------------------------------------------------------------------------

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import * as process from "process";
import { performance } from "perf_hooks";

interface Input<T = any> {
  eventId: string;
  validTime: string;
  payload: T;
  eventType: string;
  aggregator: string;
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
  eventType: string;
  aggregator: string;
  response_time?: number;
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
    const startTime = performance.now();
    const response: AxiosResponse = await axios.post(
      webhookUrl,
      input.payload,
      config,
    );
    const endTime = performance.now();

    // Constructing the response object
    const webhookResponse: WebhookResponse = {
      status: response.status,
      statusText: response.statusText,
      source_eventId: input.eventId,
      timestamp: new Date().toISOString(),
      pushName,
      eventType: input.eventType,
      aggregator: input.aggregator,
      response_time: Math.round(endTime - startTime),
    };
    return webhookResponse;
  } catch (error) {
    return {
      status: error.response?.status || 500,
      statusText: error.response?.statusText || "Internal Server Error",
      source_eventId: input.eventId,
      timestamp: new Date().toISOString(),
      pushName,
      eventType: input.eventType,
      aggregator: input.aggregator,
    } as WebhookResponse;
  }
}
