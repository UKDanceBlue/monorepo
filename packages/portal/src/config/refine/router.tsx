import type { GoFunction } from "@refinedev/core";
import {
  type GoConfig,
  type ParseResponse,
  type RouterBindings,
} from "@refinedev/core";
import {
  Link,
  type LinkProps,
  useLocation,
  useNavigate,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import qs from "qs";
import React, { type ComponentProps } from "react";
import { useCallback } from "react";

import { findResourceAction } from "./resources";

const stringifyConfig = {
  addQueryPrefix: true,
  skipNulls: true,
  arrayFormat: "indices" as const,
  encode: false,
  encodeValuesOnly: true,
};

function useGo(): GoFunction {
  const { searchStr: existingSearch, hash: existingHash } = useLocation();
  const navigate = useNavigate();

  const goFn = useCallback<GoFunction>(
    ({
      to,
      type,
      query,
      hash,
      options: { keepQuery, keepHash } = {},
    }: GoConfig) => {
      /** Construct query params */
      const urlQuery = {
        ...(keepQuery &&
          (existingSearch as string | undefined) && // TODO: Fix this
          qs.parse(existingSearch, { ignoreQueryPrefix: true })),
        ...query,
      };

      if (urlQuery.to) {
        urlQuery.to = encodeURIComponent(
          String(urlQuery.to as string | number)
        );
      }

      const hasUrlQuery = Object.keys(urlQuery).length > 0;

      /** Get hash */
      const urlHash = `#${(hash || (keepHash && existingHash) || "").replace(
        /^#/,
        ""
      )}`;

      const hasUrlHash = urlHash.length > 1;

      const urlTo = to || "";

      const fullPath = `${urlTo}${
        hasUrlQuery ? qs.stringify(urlQuery, stringifyConfig) : ""
      }${hasUrlHash ? urlHash : ""}`;

      if (type === "path") {
        return fullPath;
      }

      /** Navigate to the url */
      navigate({
        to: fullPath,
        replace: type === "replace",
      }).catch((error) => {
        console.error(error);
      });

      return fullPath;
    },
    [existingHash, existingSearch, navigate]
  );

  return goFn;
}

function useBack(): () => void {
  const {
    history: { back },
  } = useRouter();

  return back;
}

function useParse(): () => ParseResponse {
  const { pathname, search } = useLocation();
  const params: Record<string, string> = useParams({
    strict: false,
  });

  const { resource, action } = React.useMemo(() => {
    return findResourceAction(pathname);
  }, [pathname]);

  const parseFn = useCallback(() => {
    const parsedSearch = qs.parse(search, { ignoreQueryPrefix: true });

    const combinedParams = {
      ...params,
      ...parsedSearch,
    };

    const response: ParseResponse = {
      ...(resource && { resource }),
      ...(action && { action }),
      ...(params.id && { id: decodeURIComponent(params.id) }),
      pathname,
      params: {
        ...combinedParams,
        current: convertToNumberIfPossible(combinedParams.current as string) as
          | number
          | undefined,
        pageSize: convertToNumberIfPossible(
          combinedParams.pageSize as string
        ) as number | undefined,
        to: combinedParams.to
          ? decodeURIComponent(combinedParams.to as string)
          : undefined,
      },
    };

    return response;
  }, [pathname, search, params, resource, action]);

  return parseFn;
}

export const routerBindings: RouterBindings = {
  go: useGo,
  back: useBack,
  parse: useParse,
  Link: React.forwardRef<
    HTMLAnchorElement,
    ComponentProps<NonNullable<RouterBindings["Link"]>>
  >((props: LinkProps, ref) => {
    return <Link {...props} ref={ref} />;
  }),
};

const convertToNumberIfPossible = (value: string | undefined) => {
  if (value === undefined) {
    return value;
  }
  const num = Number(value);
  if (`${num}` === value) {
    return num;
  }
  return value;
};
