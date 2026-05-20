import { createClient } from "@supabase/supabase-js";
import { Group } from "./types";

/*
  Supabase에서 아래 SQL로 테이블을 먼저 생성하세요:

  create table contacts (
    id          uuid default gen_random_uuid() primary key,
    name        text not null,
    phone       text not null,
    email       text default '',
    group_name  text default '기타',
    memo        text default '',
    created_at  timestamptz default now()
  );
*/

// 실제 테이블 스키마: id, name, phone_number, email, group_name, created_at
export type ContactRow = {
  id: string;
  name: string;
  phone_number: string;
  email: string | null;
  group_name: string;
  created_at: string;
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
