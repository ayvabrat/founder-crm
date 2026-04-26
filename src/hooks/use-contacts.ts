"use client";
import { useContactsStore } from "@/store/contacts-store";
export function useContacts() { return useContactsStore(); }
