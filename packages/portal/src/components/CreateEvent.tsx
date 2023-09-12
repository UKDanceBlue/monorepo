"use client";
import "client-only";

import {
  applyValidation,
  applyValidations,
  useJsonFormSubmission,
} from "@/lib/formTools";
import {
  ApiClient,
  CreateEventBody,
  EventResource,
  PlainEvent,
  formDataToJson,
  stripNullish,
} from "@ukdanceblue/db-app-common";
import Joi from "joi";
import { useEffect, useState } from "react";
import { Duration, DateTime } from "luxon";
import dbApiClient from "@/lib/apiClient";

export default function CreateEvent() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  useEffect(() => {
    return applyValidations([
      ["#title", Joi.string().min(1).required()],
      ["#summary", Joi.string().optional()],
      ["#description", Joi.string().optional()],
      ["#location", Joi.string().optional()],
      ["#duration", Joi.number().min(10).optional()],
      ["#start", Joi.string().isoDate().required()],
    ]);
  }, []);

  useJsonFormSubmission("#createEventForm", async (data) => {
    const url = new URL("http://localhost:3001/api");
    let error: Error | null = null;

    const castData = data as {
      title: string;
      summary?: string;
      description?: string;
      location?: string;
      duration?: string;
      start: string;
    };

    const plainEvent: CreateEventBody = stripNullish({
      title: castData.title,
      images: [],
      summary: castData.summary,
      description: castData.description,
      location: castData.location,
      duration: castData.duration
        ? Duration.fromObject({ minutes: parseInt(castData.duration) })
            .normalize()
            .rescale()
            .toISO()
        : undefined,
      occurrences: [castData.start],
    });

    try {
      const res = await dbApiClient.eventApi.createEvent(plainEvent);
      console.log(JSON.stringify(res, null, 2));
    } catch (e) {
      if (e instanceof Error) error = e;
      else error = new Error("Unknown error");
    }

    if (error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage(null);
    }
  });

  return (
    <form className="flex flex-col gap-2" id="createEventForm">
      <label htmlFor="title">Title</label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="title"
        name="title"
        type="text"
        required
        onChange={(e) => {
          console.log(e.target.value);
        }}
      />
      <label htmlFor="summary">Summary</label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="summary"
        name="summary"
        type="text"
      />
      <label htmlFor="description">Description</label>
      <textarea
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="description"
        name="description"
      />
      <label htmlFor="location">Location</label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="location"
        name="location"
        type="text"
      />
      <label htmlFor="duration">Duration (minutes)</label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="duration"
        name="duration"
        type="number"
      />
      <label htmlFor="start">Start</label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="start"
        name="start"
        type="datetime-local"
        required
      />
      <output>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </output>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        Create Event
      </button>
    </form>
  );
}
