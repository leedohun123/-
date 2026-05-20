"use client";

import { Phone, Mail, Tag, FileText, Pencil, Trash2 } from "lucide-react";
import { Contact } from "@/lib/types";

const GROUP_COLOR: Record<string, string> = {
  가족: "bg-rose-100 text-rose-700",
  친구: "bg-green-100 text-green-700",
  직장: "bg-blue-100 text-blue-700",
  기타: "bg-gray-100 text-gray-600",
};

interface Props {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ContactCard({ contact, onEdit, onDelete }: Props) {
  const initials = contact.name.slice(0, 2);

  return (
    <div className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-lg select-none">
        {initials}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 truncate">{contact.name}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${GROUP_COLOR[contact.group]}`}>
            {contact.group}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          <a href={`tel:${contact.phone}`} className="hover:text-blue-600 transition">{contact.phone}</a>
        </div>

        {contact.email && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <a href={`mailto:${contact.email}`} className="hover:text-blue-600 transition truncate">{contact.email}</a>
          </div>
        )}

        {contact.memo && (
          <div className="flex items-start gap-1.5 text-sm text-gray-500">
            <FileText className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{contact.memo}</span>
          </div>
        )}
      </div>

      <div className="flex shrink-0 gap-1">
        <button onClick={onEdit}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={onDelete}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
