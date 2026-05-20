"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Plus, Search, Users, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Contact, Group } from "@/lib/types";
import { supabase, ContactRow } from "@/lib/supabase";
import ContactCard from "./ContactCard";
import ContactForm from "./ContactForm";
import DeleteModal from "./DeleteModal";

const ALL_GROUPS = ["전체", "가족", "친구", "직장", "기타"] as const;

function rowToContact(row: ContactRow): Contact {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone_number,
    email: row.email ?? "",
    group: (row.group_name as Group) ?? "기타",
    memo: "",
    createdAt: new Date(row.created_at).getTime(),
  };
}

type Toast = { id: number; message: string; type: "success" | "error" };

export default function Phonebook() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("전체");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<Contact | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  function addToast(message: string, type: Toast["type"] = "success") {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      addToast(error.message, "error");
    } else {
      setContacts((data as ContactRow[]).map(rowToContact));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  async function handleSave(data: Omit<Contact, "id" | "createdAt">) {
    setSaving(true);
    const payload = {
      name: data.name,
      phone_number: data.phone,
      email: data.email,
      group_name: data.group,
    };

    if (editing) {
      const { error } = await supabase
        .from("contacts")
        .update(payload)
        .eq("id", editing.id);
      if (error) { addToast(error.message, "error"); setSaving(false); return; }
      addToast(`${data.name} 연락처가 수정됐습니다.`);
    } else {
      const { error } = await supabase.from("contacts").insert([payload]);
      if (error) { addToast(error.message, "error"); setSaving(false); return; }
      addToast(`${data.name} 연락처가 추가됐습니다.`);
    }

    setSaving(false);
    setShowForm(false);
    setEditing(null);
    fetchContacts();
  }

  async function handleDelete() {
    if (!deleting) return;
    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", deleting.id);

    if (error) addToast(error.message, "error");
    else addToast(`${deleting.name} 연락처가 삭제됐습니다.`);

    setDeleting(null);
    fetchContacts();
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return contacts
      .filter((c) => activeGroup === "전체" || c.group === activeGroup)
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      );
  }, [contacts, query, activeGroup]);

  const groupCounts = useMemo(() => {
    const map: Record<string, number> = { 전체: contacts.length };
    contacts.forEach((c) => { map[c.group] = (map[c.group] ?? 0) + 1; });
    return map;
  }, [contacts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Toast */}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              t.type === "success" ? "bg-emerald-500" : "bg-red-500"
            }`}
          >
            {t.type === "success"
              ? <CheckCircle className="h-4 w-4 shrink-0" />
              : <XCircle className="h-4 w-4 shrink-0" />
            }
            {t.message}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 shadow-md shadow-blue-200">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">전화번호부</h1>
              <p className="text-sm text-gray-400">총 {contacts.length}명의 연락처</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchContacts}
              disabled={loading}
              className="flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-sm hover:bg-gray-50 disabled:opacity-40 transition"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200 hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" />
              추가
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          {(["가족", "친구", "직장", "기타"] as Group[]).map((g) => {
            const colors: Record<Group, string> = {
              가족: "bg-rose-50 border-rose-100 text-rose-600",
              친구: "bg-green-50 border-green-100 text-green-600",
              직장: "bg-blue-50 border-blue-100 text-blue-600",
              기타: "bg-gray-50 border-gray-200 text-gray-500",
            };
            return (
              <button
                key={g}
                onClick={() => setActiveGroup(activeGroup === g ? "전체" : g)}
                className={`rounded-xl border p-3 text-center transition hover:shadow-sm ${colors[g]} ${
                  activeGroup === g ? "ring-2 ring-current ring-offset-1" : ""
                }`}
              >
                <div className="text-xl font-bold">{groupCounts[g] ?? 0}</div>
                <div className="text-xs font-medium">{g}</div>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름, 전화번호, 이메일로 검색"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        {/* Group Filter */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {ALL_GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeGroup === g
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {g}
              <span className="ml-1 opacity-60">({groupCounts[g] ?? 0})</span>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[88px] animate-pulse rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Users className="h-8 w-8 text-gray-300" />
            </div>
            <p className="font-medium text-gray-400">
              {query ? "검색 결과가 없습니다." : "등록된 연락처가 없습니다."}
            </p>
            {!query && (
              <button
                onClick={() => { setEditing(null); setShowForm(true); }}
                className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                첫 연락처 추가하기
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={() => { setEditing(contact); setShowForm(true); }}
                onDelete={() => setDeleting(contact)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <ContactForm
          initial={editing ?? undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          saving={saving}
        />
      )}
      {deleting && (
        <DeleteModal
          name={deleting.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
