export type Group = "가족" | "친구" | "직장" | "기타";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  group: Group;
  memo: string;
  createdAt: number;
}
