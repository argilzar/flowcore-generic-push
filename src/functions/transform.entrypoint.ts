// -----------------------------------------------------------------------------
// Purpose: Transform entrypoint
// this is the entrypoint that will be called when the transformer is invoked
// to transform an event, the return value of this function will be passed to
// the read model adapter.
// -----------------------------------------------------------------------------

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import * as process from "process";
import { performance } from "perf_hooks";
import { AccessToken, ClientCredentials } from "simple-oauth2";

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
const authApiKey = process.env.AUTH_API_KEY || "";
const authTokenHost = process.env.AUTH_TOKEN_HOST || "";
const authTokenPath = process.env.AUTH_TOKEN_PATH || "/oauth2/token";
const responseRecieptPath = process.env.RESPONSE_RECIEPT_PATH || "";

let token: AccessToken;

interface WebhookResponse {
  status: number;
  statusText: string;
  timestamp?: string;
  source_eventId?: string;
  pushName?: string;
  eventType: string;
  aggregator: string;
  response_time?: number;
  response?: any;
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
      if (authApiKey) {
        config.headers["x-api-key"] = authApiKey;
      }
      break;
    case "static-auth-header":
      config.headers.Authorization = authHeader;
      if (authApiKey) {
        config.headers["x-api-key"] = authApiKey;
      }
      break;
    case "client-credentials-get-method":
      config.headers.Authorization = `Bearer ${await clientCredentialsGETMethod()}`;
      if (authApiKey) {
        config.headers["x-api-key"] = authApiKey;
      }
      break;
    case "oauth2":
      config.headers.Authorization = `Bearer ${await getoAuthToken()}`;
      if (authApiKey) {
        config.headers["x-api-key"] = authApiKey;
      }
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
      response: responseRecieptPath ? response.data[responseRecieptPath] : null,
    };
    return webhookResponse;
  } catch (error) {
    console.error(error.message);
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

async function clientCredentialsGETMethod() {
  if (token) {
    if (!token.expired()) {
      return token.token.access_token;
    }
  }

  const config = {
    options: {
      bodyFormat: "json",
    },
    client: {
      id: authUsername,
      secret: authPassword,
    },
    auth: {
      tokenHost: authTokenHost,
      tokenPath: authTokenPath,
    },
  };
  const client = new ClientCredentials(config);

  const url = `${config.auth.tokenHost}${config.auth.tokenPath}?clientId=${config.client.id}&clientSecret=${config.client.secret}`;

  try {
    const response: AxiosResponse = await axios.get(url);
    // Manually set the token
    const manualToken = {
      access_token: response.data.token,
      token_type: "Bearer",
      expires_in: 1800,
    };
    token = client.createToken(manualToken);
    return token.token.access_token;
  } catch (error) {
    console.error(error);
  }
}

async function getoAuthToken() {
  if (token) {
    if (!token.expired()) {
      return token.token.access_token;
    }
  }
  const config = {
    options: {
      bodyFormat: "json",
    },
    client: {
      id: authUsername,
      secret: authPassword,
    },
    auth: {
      tokenHost: authTokenHost,
      tokenPath: authTokenPath,
    },
  };
  const client = new ClientCredentials(config);

  const tokenParams = {};

  try {
    token = await client.getToken(tokenParams, {
      headers: {
        "x-api-key": authApiKey,
      },
    });

    return token.token.access_token;
  } catch (error) {
    console.error("Access Token Error", error.message);
    process.exit(1);
  }
}
