/**
 * Utility Functions
 * A collection of helper methods for formatting dates, numbers, 
 * and managing state within the application.
 */

import { ZustandSetStateArg } from "@/types";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { AxiosError } from "axios";

export default function formatDate(date: Date): string {
  if (!date) return "";
  const now = new Date();

  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return formatter.format(date);
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  return fullDateFormatter.format(date);
}

export const formatBalanceAmount = (amount: number, currency?: string) => {
  const currencySymbol = currency === "NGN" || !currency ? "N" : currency;
  const absoluteAmount = Math.abs(amount);
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absoluteAmount);
  const sign = amount < 0 ? "-" : "";
  return `${sign}${currencySymbol}${formattedAmount}`;
};

export const createSetState =
  <T extends object>(key: keyof T, set: any) =>
  (value: ZustandSetStateArg<any>) =>
    set((state: T) =>
      typeof value === "function"
        ? { [key]: value(state[key]) }
        : { [key]: value },
    );

// export const cloneObj = <T extends object>(obj: T): T => JSON.parse(JSON.stringify(obj));
export const cloneObj = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cloneObj) as unknown as T;
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, cloneObj(value)]),
  ) as T;
};

export const formatTimeForMessage = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

type Item<T> = T & { [key: string]: any };

type Order = "prepend" | "append";

export const mergeArrays = <T>({
  prevArr,
  newArr,
  id,
  order = "prepend",
}: {
  prevArr: Item<T>[];
  newArr: Item<T>[];
  id?: keyof T;
  order?: Order;
}): Item<T>[] => {
  const mergedMap = new Map<any, Item<T>>();
  const result: Item<T>[] = [];

  const getKey = (item: Item<T>) => (id != null ? item[id] : item);

  for (const item of prevArr) {
    const key = getKey(item);
    mergedMap.set(key, item);
    result.push(item);
  }

  for (const item of newArr) {
    const key = getKey(item);
    if (mergedMap.has(key)) {
      const existingIndex = result.findIndex(
        (existingItem) => getKey(existingItem) === key,
      );
      if (existingIndex !== -1) {
        result[existingIndex] = item;
      }
    } else {
      if (order === "prepend") {
        result.unshift(item);
      } else {
        result.push(item);
      }
    }
    mergedMap.set(key, item);
  }

  return result;
};

export const normalizeParam = (param: unknown): string =>
  Array.isArray(param) ? String(param[0] ?? "") : String(param ?? "");

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error?.response?.data?.message || "An unknown error occurred";
  }

  if (error instanceof Error) {
    return error.message || "An unknown error occurred";
  }

  return "An unknown error occurred";
};

export const getEdgeFunctionError = async (error: unknown) => {
  if (error instanceof FunctionsHttpError) {
    const parsedError = await error.context.json();
    return parsedError;
  }

  return error;
};
