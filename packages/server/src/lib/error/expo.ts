import {
  CompositeError,
  ErrorCode,
  ExtendedError,
} from "@ukdanceblue/common/error";
import type { ExpoPushErrorTicket } from "expo-server-sdk";

export abstract class ExpoError extends ExtendedError {
  readonly expose = false;
}

export class ExpoPushTicketError extends ExpoError {
  constructor(public readonly ticket: ExpoPushErrorTicket) {
    super(ticket.message, ErrorCode.ExpoPushTicketError.description);
  }

  get tag(): ErrorCode.ExpoPushTicketError {
    return ErrorCode.ExpoPushTicketError;
  }

  get ticketCode() {
    return this.ticket.details?.error;
  }
}

export class ExpoPushFailureError extends CompositeError<ExpoPushTicketError> {
  constructor(tickets: ExpoPushErrorTicket[]) {
    super(tickets.map((ticket) => new ExpoPushTicketError(ticket)));
  }
}
