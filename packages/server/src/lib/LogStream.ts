/**
 * Accepts log messages from winston and sends them to any Koa clients that are
 * listening to server-sent events.
 */
import { Writable } from "stream";

import { logger } from "../logger.js";

export class LogStream extends Writable {
  private subscribers = new Set<Writable>();

  /**
   * Add a subscriber to this log stream
   *
   * @param subscriber The subscriber to add
   */
  addWriteable(subscriber: Writable) {
    this.subscribers.add(subscriber);
    subscriber.on("close", () => {
      this.subscribers.delete(subscriber);
    });
  }

  /**
   * Send a log message to all subscribers
   *
   * @param chunk The log message to send
   * @param encoding The encoding of the log message
   * @param callback The callback to call when the message has been sent
   */
  _write(
    chunk: unknown,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ) {
    const promises: Promise<void>[] = [];
    for (const subscriber of this.subscribers) {
      promises.push(
        new Promise((resolve, reject) => {
          subscriber.write(chunk, encoding, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        })
      );
    }
    void Promise.all(promises)
      .finally(() => {
        callback(null);
      })
      .catch((error) => {
        logger.error("Error writing to log stream", error);
      });
  }

  /**
   * Called when the log stream is closed
   *
   * @param callback The callback to call when the stream has been closed
   */
  _final(callback: (error?: Error | null) => void) {
    for (const subscriber of this.subscribers) {
      subscriber.end();
    }
    callback();
  }
}
