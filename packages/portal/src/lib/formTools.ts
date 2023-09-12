"use client";
import "client-only";

import Joi from "joi";

import { formDataToJson } from "@ukdanceblue/db-app-common";
import { useEffect } from "react";

export function applyValidation(
  elementSelector: string,
  validator: Joi.Schema
): () => void {
  const element = document.querySelector(elementSelector);

  if (!element) {
    throw new Error(`Element ${elementSelector} not found`);
  }

  if (
    !(
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLButtonElement ||
      element instanceof HTMLOutputElement
    )
  ) {
    throw new Error(`Element ${elementSelector} is not an input or textarea`);
  }

  let friendlyName = element.name;
  if (element.labels && element.labels.length > 0) {
    friendlyName = element.labels[0]?.textContent || element.name;
  }

  const inputListener = () => {
    const { error } = Joi.object({ [friendlyName]: validator }).validate({
      [friendlyName]: element.value,
    });
    if (error) {
      let { message } = error;
      if (error.details.length > 0) {
        message ??= error.details[0]?.message ?? "Invalid input";
      }
      if (!message) {
        message = "Invalid input";
      }
      element.setCustomValidity(message);
    } else {
      element.setCustomValidity("");
    }
  };
  element.addEventListener("input", inputListener);
  return () => {
    element.removeEventListener("input", inputListener);
  };
}

export function applyValidations(
  argsList: Parameters<typeof applyValidation>[]
): () => void {
  const cleanupFunctions = argsList.map((args) => applyValidation(...args));
  return () => {
    cleanupFunctions.forEach((fn) => fn());
  };
}

export function useJsonFormSubmission(
  formSelector: string,
  onSubmit: (response: unknown) => void | Promise<void>,
  // TODO: use a better default error handler
  handleError: (error: unknown) => void = console.error
): void {
  useEffect(() => {
    const form = document.querySelector(formSelector);
    if (!form) {
      throw new Error(`Form ${formSelector} not found`);
    }
    if (!(form instanceof HTMLFormElement)) {
      throw new Error(`Element ${formSelector} is not a form`);
    }

    const listener = (event: SubmitEvent) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        return;
      }
      const formData = new FormData(form);
      const json = formDataToJson(formData);
      Promise.resolve(onSubmit(json)).catch(handleError);
    };
    form.addEventListener("submit", listener);
    return () => {
      form.removeEventListener("submit", listener);
    };
  }, [formSelector, onSubmit, handleError]);
}
