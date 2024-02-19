# Generic push adapter for flowcore.io

This is a generic push adapter for the flowcore.io platform. It is used to push data from a datacore to a webhook.

## 📝 Quick start

Setup a scenario using this typescript adapter.

Set the appropriate environment variables:

- `WEBHOOK_URL`: The URL of the webhook.
- `AUTH_TYPE`: The type of authentication to use. Can be "basic" or "static-auth-header".
- `AUTH_HEADER`: The authorization header to use when `AUTH_TYPE` is "static-auth-header".
- `AUTH_USERNAME`: The username to use when `AUTH_TYPE` is "basic".
- `AUTH_PASSWORD`: The password to use when `AUTH_TYPE` is "basic".
- `PUSH_NAME`: The name of the push.

The `authType` environment variable can have two possible values:

- `"basic"`: This value indicates that Basic Authentication should be used. In this case, the `authUsername` and `authPassword` environment variables are used to generate the `Authorization` header.
- `"static-auth-header"`: This value indicates that a static `Authorization` header should be used. In this case, the `authHeader` environment variable is used as the `Authorization` header.

## Return value

If you want to store the response from the webhook, you can pipe the response to a datacore. The response will be a JSON object with the following properties:

- `status` (Number): The status code of the webhook response.
- `statusText` (String): The status text of the webhook response.
- `source_eventId` (String, optional): The source event ID.
- `timestamp` (String, optional): The timestamp when the webhook response was created.
- `pushName` (String, optional): The name of the push, retrieved from the `PUSH_NAME` environment variable.

## Example

```json
{
  "status": 200,
  "statusText": "OK",
  "source_eventId": "event-id",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "pushName": "push-name"
}
```

In case of an error during the execution of the function, it returns a `WebhookResponse` object with a status of 500 and a status text of "Internal Server Error". The `source_eventId`, `timestamp`, and `pushName` fields are also included in the error response.

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
