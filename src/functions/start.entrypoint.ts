// -----------------------------------------------------------------------------
// Purpose: Start entrypoint
// this is the entrypoint that will be called when the transformer is started
// -----------------------------------------------------------------------------

export default async function () {
  console.log(
    `Initializing push adapter using webhook ${process.env.WEBHOOK_URL}.`,
  );
}
