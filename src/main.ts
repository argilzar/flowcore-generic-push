// -------------------------------------------------------------------
// This is the main entrypoint to the transformer, it should not be
// necessary to modify this file for a basic transformer.
// -------------------------------------------------------------------
import express, { Request, Response } from "express";
import health from "@functions/health.entrypoint";
import transform from "@functions/transform.entrypoint";
import start from "@functions/start.entrypoint";
import * as console from "console";

const app = express();

app.use(express.json());

app.get("/health", async (req: Request, res: Response): Promise<Response> => {
  return res.send(await health());
});

app.post(
  "/transform",
  async (req: Request, res: Response): Promise<Response> => {
    const { eventId, validTime, payload, eventType, aggregator } = req.body;
    const result = await transform({
      eventId,
      validTime,
      payload,
      eventType,
      aggregator,
    });
    return res.status(result.status).send(result);
  },
);

const run = async (): Promise<void> => {
  const port = process.env.PORT || 4000;
  try {
    await start();
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void run();
