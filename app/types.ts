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
