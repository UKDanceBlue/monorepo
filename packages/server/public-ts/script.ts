function urlencodeFormData(formData: FormData) {
  let s = "";
  function encode(s: string | number | boolean) {
    return encodeURIComponent(s).replace(/%20/g, "+");
  }
  for (const [key, value] of formData) {
    s +=
      (s ? "&" : "") +
      encode(key) +
      "=" +
      encode(value instanceof File ? value.name : value);
  }
  return s;
}

/**
 * This function overrides the default form submission behavior of a form for GET and POST.
 *
 * Rather than navigating to the form's action URL, it will instead send an XHR request to the form's action URL.
 */
function xhrifyFormElement(form: HTMLFormElement) {
  form.addEventListener("submit", (event: SubmitEvent) => {
    console.log("Form submitted!");
    const form: HTMLFormElement | null =
      event.target instanceof HTMLFormElement ? event.target : null;
    if (form == null) {
      console.error("Event target of form listener is not a form!");
      return;
    }
    let baseUrl = form.action;
    if (baseUrl == null || baseUrl === "") {
      baseUrl = window.location.href;
    }

    const requestUrl = new URL(baseUrl, window.location.href);

    const shouldClear = form.getAttribute("data-clear-form") === "true";

    // Decide on encoding
    const formenctype =
      event.submitter?.getAttribute("formenctype") ??
      event.submitter?.getAttribute("formencoding");
    const enctype =
      formenctype ??
      form.getAttribute("enctype") ??
      form.getAttribute("encoding") ??
      "application/x-www-form-urlencoded";

    // Decide on method
    let formMethod =
      event.submitter?.getAttribute("formmethod") ??
      form.getAttribute("method")?.toLowerCase() ??
      "get";

    // @ts-expect-error submitter is not in the TS definition, but is in firefox and safari, coming to chromium soon
    const formData = new FormData(form, event.submitter);

    for (const [key, value] of formData) {
      console.log(key, value);
    }

    const requestOptions: RequestInit = {
      method: formMethod,
    };

    // Encode body
    if (formMethod === "get") {
      requestUrl.search = new URLSearchParams(
        urlencodeFormData(formData)
      ).toString();
    } else if (formMethod === "post") {
      console.log(enctype);
      if (enctype === "application/x-www-form-urlencoded") {
        console.log("Encoding form data");
        requestOptions.body = urlencodeFormData(formData);
        console.log(requestOptions.body);
        requestOptions.headers = {
          "Content-Type": "application/x-www-form-urlencoded",
        };
      } else if (enctype === "multipart/form-data") {
        requestOptions.body = formData;
      } else if (enctype === "text/plain") {
        requestOptions.body = "";
        for (const [formKey, formValue] of formData) {
          requestOptions.body += `${formKey}=${JSON.stringify(formValue)}\n`;
        }
        requestOptions.headers = {
          "Content-Type": "text/plain",
        };
      } else {
        throw new Error(`Illegal enctype: ${enctype}`);
      }
    } else if (formMethod === "dialog") {
      // Allow default behavior
      return;
    } else {
      throw new Error(`Illegal form method: ${formMethod}`);
    }

    console.log(requestUrl);
    console.log(requestOptions);

    fetch(requestUrl, requestOptions)
      .then((response) => {
        if (response.ok) {
          if (shouldClear) {
            form.reset();
          }
          form.dispatchEvent(
            new CustomEvent("xhr-form-success", {
              detail: response,
            })
          );
        } else {
          form.dispatchEvent(
            new CustomEvent("xhr-form-failure", {
              detail: response,
            })
          );
        }
        return response;
      })
      .catch((err) => {
        form.dispatchEvent(
          new CustomEvent("xhr-form-failure", {
            detail: err,
          })
        );
      });

    event.preventDefault();
  });
}

document.onload = () => {
  const forms = document.getElementsByClassName("xhr-form");
  for (const form of forms) {
    if (!(form instanceof HTMLFormElement)) {
      console.error("Found non-form element with class xhr-form");
      continue;
    }
    xhrifyFormElement(form);
  }
};
