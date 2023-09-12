"use client";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { DateTime, Duration } from "luxon";
import { useMemo, useEffect, useState, useReducer } from "react";

import { EventResource } from "@ukdanceblue/db-app-common";
import dbApiClient from "@/lib/apiClient";

const columnHelper = createColumnHelper<EventResource>();

export const columns: ColumnDef<EventResource, any>[] = [
  columnHelper.accessor("title", {
    cell: (row) => row.getValue(),
    header: "Title",
  }),
  columnHelper.accessor("occurrences", {
    cell: (row) =>
      row.getValue<DateTime[]>()[0]?.toLocaleString(DateTime.DATETIME_SHORT),
    header: "First Occurrence",
  }),
  columnHelper.accessor("duration", {
    cell: (row) => row.getValue<Duration | undefined>()?.toFormat("h:mm"),
    header: "Duration",
  }),
  columnHelper.accessor("location", {
    cell: (row) => row.getValue(),
    header: "Location",
  }),
  columnHelper.accessor("eventId", {
    cell: (row) => <a href={`/events/${row.getValue()}`}>View</a>,
    header: "View",
  }),
];

export default function EventTable() {
  const [events, setEvents] = useState<EventResource[]>([]);

  useEffect(() => {
    dbApiClient.eventApi.getEvents().then((res) => {
      setEvents(res.resource.resources ?? []);
    });
  }, []);

  const table = useReactTable({
    columns,
    data: events,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table className="table-auto w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 border-2 border-gray-500"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-2 border-2 border-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={
                    "px-4 py-2" +
                    (header.isPlaceholder ? " border-2 border-gray-500" : "")
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}
