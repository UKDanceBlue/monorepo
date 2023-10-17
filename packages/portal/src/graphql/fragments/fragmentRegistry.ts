import { createFragmentRegistry } from "@apollo/client/cache";

import {
  EVENT_FRAGMENT,
  EVENT_IMAGES_FRAGMENT,
  EVENT_WITH_IMAGES_FRAGMENT,
} from "./eventFragments";
import { IMAGE_FRAGMENT, IMAGE_THUMBHASH_FRAGMENT } from "./imageFragments";

export const fragmentRegistry = createFragmentRegistry(
  IMAGE_FRAGMENT,
  IMAGE_THUMBHASH_FRAGMENT,
  EVENT_FRAGMENT,
  EVENT_IMAGES_FRAGMENT,
  EVENT_WITH_IMAGES_FRAGMENT
);
