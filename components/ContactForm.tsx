"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Contact, Group } from "@/lib/types";

const GROUPS: Group[] = ["가족", "친구", "직장", "기타"];

interface Props {
  initial?: Contact;
  onSave: (data: Omit<Contact, "id" | "createdAt">) => void;
  onCancel: () => void;
  saving?: boolean;
}

export default function ContactForm({ initial, onSave, onCancel, saving = false }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [group, setGroup] = useState<Group>(initial?.group ?? "기타");
  const [memo, setMemo] = useState(initial?.memo ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "이름을 입력하세요.";
    if (!phone.trim()) e.phone = "전화번호를 입력하세요.";
    else if (!/^[\d\-+\s()]+$/.test(phone)) e.phone = "올바른 전화번호 형식이 아닙니다.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "올바른 이메일 형식이 아닙니다.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ name: name.trim(), phone: phone.trim(), email: email.trim(), group, memo: memo.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {initial ? "연락처 수정" : "새 연락처 추가"}
          </h2>
          <button onClick={onCancel} className="rounded-full p-1 hover:bg-gray-100 transition">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <Field label="이름 *" error={errors.name}>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="홍길동"
              className={input(errors.name)}
            />
          </Field>

          <Field label="전화번호 *" error={errors.phone}>
            <input
              value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className={input(errors.phone)}
            />
          </Field>

          <Field label="이메일" error={errors.email}>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className={input(errors.email)}
            />
          </Field>

          <Field label="그룹">
            <select value={group} onChange={e => setGroup(e.target.value as Group)} className={input()}>
              {GROUPS.map(g => <option key={g}>{g}</option>)}
            </select>
          </Field>

          <Field label="메모">
            <textarea
              value={memo} onChange={e => setMemo(e.target.value)}
              rows={3} placeholder="메모를 입력하세요"
              className={input() + " resize-none"}
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel}
              className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              취소
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition">
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function input(error?: string) {
  return `w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
    error ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:border-blue-400 focus:ring-blue-100"
  }`;
}
