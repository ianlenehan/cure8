export type UserType = {
  id: string;
  name: string;
  phone: string;
};

export type ConversationType = {
  id: string;
  title: string;
  users: [UserType];
  updatedAt: string;
};
