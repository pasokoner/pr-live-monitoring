"use client";

import React from "react";
import { DataTable } from "./focal-prs/data-table";
import { columns, outColumns } from "./focal-prs/columns";
import { api } from "@/trpc/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FocalPage() {
  const { data, isLoading } = api.supply.focalSupply.useQuery();

  if (isLoading) return null;

  const inPr = data
    ?.filter((data) => !data.outDate)
    .map((data) => ({
      ...data,
      date: data.createdAt,
    }));
  const outPr = data
    ?.filter((data) => !!data.outDate)
    .map((data) => ({
      ...data,
      date: data.outDate!,
    }));

  console.log(outPr);

  return (
    <Tabs defaultValue="In">
      <TabsList>
        <TabsTrigger value="In">In</TabsTrigger>
        <TabsTrigger value="Out">Out</TabsTrigger>
      </TabsList>
      <TabsContent value="In">
        <DataTable data={inPr!} columns={columns} />
      </TabsContent>
      <TabsContent value="Out">
        <DataTable data={outPr!} columns={outColumns} />
      </TabsContent>
    </Tabs>
  );
}
