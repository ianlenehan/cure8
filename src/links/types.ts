export type CurationType = {
  id: string;
  link: { title: string; image: string; url: string };
  comment?: string;
  createdAt: string;
  curatorName: string;
  curatorId: string;
  rating: string;
  tags: TagType[];
  sharedWith: [{ id: string; phone: string; name: string }];
};

export type TagType = {
  id: string;
  name: string;
};

export type ArchiveVariablesType = {
  id: string;
  tags: string[];
  rating: string;
};
