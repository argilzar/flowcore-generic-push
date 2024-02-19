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

## 📦 Development

See the [template repository](https://github.com/flowcore-io/nodejs-typescript-transformer-example) for more information on how to develop this adapter.
