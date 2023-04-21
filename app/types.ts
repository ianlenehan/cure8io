import type { Database } from "db_types";

export type Curation = {
  comment: string;
  curatorId: string;
  curatorName: string;
  date: FirebaseFirestore.Timestamp;
  id: string;
  linkId: string;
  opened?: boolean;
  rating?: string;
  selfSave?: boolean;
  status: string;
  url: string;
  userEmail: string;
  userName: string;
};

export type Link = {
  comment: string;
  curatorId: string;
  curatorName: string;
  date: Date;
  image: string;
  title: string;
  url: string;
  id: string;
};

export type List = Database["public"]["Tables"]["lists"]["Row"];

export type ListTag = Database["public"]["Tables"]["tags"]["Row"];

export type Batch = Database["public"]["Tables"]["batches"]["Row"];

export type Post = Database["public"]["Tables"]["posts"]["Row"];
