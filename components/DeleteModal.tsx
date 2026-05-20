"use client";

import { AlertTriangle } from "lucide-react";

interface Props {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ name, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-800">연락처 삭제</h3>
        <p className="mb-6 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{name}</span>을(를) 삭제하시겠습니까?<br />
          이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            취소
          </button>
          <button onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition">
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
