export type CurationType = {
  id: string;
  comment?: string;
  date: string;
  curatorName: string;
  curatorId: string;
  linkId: string;
  rating: string;
  tags?: TagType[];
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

export type LinkType = {
  curatorName: string;
  id: string;
  title: string;
  image: string;
  url: string;
};
