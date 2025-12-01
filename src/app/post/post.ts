export interface Post {
  _id: string;        // ✅ matches MongoDB
  title: string;
  body: string;
  comment?: string;
  createdAt?: string;  // optional, from timestamps
  updatedAt?: string;
}
