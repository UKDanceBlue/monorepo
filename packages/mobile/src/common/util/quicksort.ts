import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { DateTime } from "luxon";

const partition = (array: { date: DateTime; event: FirestoreEvent }[], left = 0, right: number = array.length - 1) => {
  const pivot = array[Math.floor((right + left) / 2)];
  let i = left;
  let j = right;

  while (i <= j) {
    while (array[i] < pivot) {
      i++;
    }

    while (array[j] > pivot) {
      j--;
    }

    if (i <= j) {
      [ array[i], array[j] ] = [ array[j], array[i] ];
      i++;
      j--;
    }
  }

  return i;
};

export const quickSort = (array: { date: DateTime; event: FirestoreEvent }[], left = 0, right: number = array.length - 1) => {
  let index : number;

  if (array.length > 1) {
    index = partition(array, left, right);

    if (left < index - 1) {
      quickSort(array, left, index - 1);
    }

    if (index < right) {
      quickSort(array, index, right);
    }
  }

  return array;
};
