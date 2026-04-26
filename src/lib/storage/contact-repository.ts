import { saveJSON, readJSON } from "./local-storage";
import type { Contact } from "@/types/contact";
const KEY = "founder-crm-contacts-repo";
export const contactRepository = { save: (contacts: Contact[]) => saveJSON(KEY, contacts), load: () => readJSON<Contact[]>(KEY, []) };
