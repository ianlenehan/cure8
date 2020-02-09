export type Curation = {
  id: string;
  link: { title: string; image: string; url: string };
  comment?: string;
  createdAt: string;
  curatorName: string;
  curatorId: string;
  rating: string;
  tags: [TagType];
};

export type TagType = {
  id: string;
  name: string;
};
