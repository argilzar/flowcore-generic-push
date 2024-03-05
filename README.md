# Generic push adapter for flowcore.io

This is a generic push adapter for the flowcore.io platform. It is used to push data from a datacore to a webhook.

## 📝 Quick start

Setup a scenario using this typescript adapter.

![scenario](https://github.com/argilzar/flowcore-generic-push/assets/60230/aa17b8f9-7b91-4f75-91af-ce00073f0a61)

Set the appropriate environment variables:

- `WEBHOOK_URL`: The URL of the webhook. This is where the transformed data will be sent.
- `AUTH_TYPE`: The type of authentication used.
- `AUTH_USERNAME`: The username used for authentication.
- `AUTH_PASSWORD`: The password used for authentication.
- `AUTH_API_KEY`: The API key used for authentication.
- `AUTH_HEADER`: The static `Authorization` header used for authentication.
- `PUSH_NAME`: The name of the push.
- `RESPONSE_RECIEPT_PATH`: The path of the response receipt.
- `AUTH_TOKEN_HOST`: The host of the authentication token.
- `AUTH_TOKEN_PATH`: The path of the authentication token.

The `AUTH_TYPE` environment variable in your project can have three possible values:

- `"basic"`: This value indicates that Basic Authentication should be used. In this case, the `AUTH_USERNAME` and `AUTH_PASSWORD` environment variables are used to generate the `Authorization` header.

- `"static-auth-header"`: This value indicates that a static `Authorization` header should be used. In this case, the `AUTH_HEADER` environment variable is used as the `Authorization` header.

- `"oauth2"`: This value indicates that OAuth 2.0 authentication should be used. In this case, the `AUTH_USERNAME`, `AUTH_PASSWORD`, `AUTH_TOKEN_HOST`, and `AUTH_TOKEN_PATH` environment variables are used to obtain an access token from the OAuth 2.0 server. The obtained access token is then used in the `Authorization` header for the webhook request.

## Return value

The `webhookResponse` is an object of type `WebhookResponse`. This object is constructed after a webhook request is made and it contains the following properties:

- `status` (Number): The HTTP status code of the webhook response.
- `statusText` (String): The HTTP status text of the webhook response.
- `timestamp` (String, optional): The timestamp when the webhook response was created. It is in ISO string format.
- `source_eventId` (String, optional): The source event ID. This is the `eventId` from the input to the transform function.
- `pushName` (String, optional): The name of the push, retrieved from the `PUSH_NAME` environment variable.
- `eventType` (String): The type of the event. This is the `eventType` from the input to the transform function.
- `aggregator` (String): The aggregator. This is the `aggregator` from the input to the transform function.
- `response_time` (Number, optional): The time taken for the webhook request to complete. It is calculated as the difference between the time when the request was made and the time when the response was received.
- `response` (any, optional): The response from the webhook request. If the `RESPONSE_RECIEPT_PATH` environment variable is set, this will be the value at that path in the response data. If `RESPONSE_RECIEPT_PATH` is not set, this will be `null`.

Here is the TypeScript interface for `WebhookResponse`:

```typescript
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
```

## Example

```json
{
  "status": 200,
  "statusText": "OK",
  "source_eventId": "2bd45910-dad5-11ee-a964-b3d69862b2aa",
  "timestamp": "2024-03-05T11:55:14.502Z",
  "pushName": "iotplatform",
  "eventType": "test.0",
  "aggregator": "reefer-iot-archive",
  "response_time": 213,
  "response": "e981c356-a268-4482-82e6-313d3f094f9e"
}
```

In case of an error during the execution an object with a status of 500 and a status text of "Internal Server Error". The `source_eventId`, `timestamp`, and `pushName` fields are also included in the error response.

## Error Example

```json
{
  "status": 500,
  "statusText": "Internal Server Error",
  "source_eventId": "event-id",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "pushName": "push-name"
}
```

## 📦 Development

See the [template repository](https://github.com/flowcore-io/nodejs-typescript-transformer-example) for more information on how to develop this adapter.
