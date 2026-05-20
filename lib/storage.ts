"use client";

import { Contact } from "./types";

const KEY = "phonebook_contacts";

export function loadContacts(): Contact[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveContacts(contacts: Contact[]): void {
  localStorage.setItem(KEY, JSON.stringify(contacts));
}
