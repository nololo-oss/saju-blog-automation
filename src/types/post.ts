export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  category: string;
  tags?: string[];
  thumbnail?: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string; // HTML string
}

export interface PostMeta {
  slug: string;
  frontmatter: PostFrontmatter;
}
