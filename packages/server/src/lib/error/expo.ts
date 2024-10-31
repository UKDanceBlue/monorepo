import {
  CompositeError,
  ConcreteError,
  ErrorCode,
} from "@ukdanceblue/common/error";
import type { ExpoPushErrorTicket } from "expo-server-sdk";

export abstract class ExpoError extends ConcreteError {
  constructor() {
    super();
  }

  get expose() {
    return false;
  }
}

export class ExpoPushTicketError extends ExpoError {
  readonly #ticket: ExpoPushErrorTicket;

  constructor(ticket: ExpoPushErrorTicket) {
    super();
    this.#ticket = ticket;
  }

  get message(): string {
    return this.#ticket.message;
  }

  get tag(): ErrorCode.ExpoPushTicketError {
    return ErrorCode.ExpoPushTicketError;
  }

  get tickerCode() {
    return this.#ticket.details?.error;
  }
}

export class ExpoPushFailureError extends CompositeError<ExpoPushTicketError> {
  #message: string;

  constructor(message: string, tickets: ExpoPushErrorTicket[]) {
    super(tickets.map((ticket) => new ExpoPushTicketError(ticket)));
    this.#message = message;
  }

  get message() {
    return this.#message;
  }
}
