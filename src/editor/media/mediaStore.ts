import { PageNode } from '@/editor/types/page';

export const mediaAssets: {
  id: string;
  label: string;
  category: string;
  src: string;
  node: PageNode;
}[] = [
  {
    id: 'media-hero-1',
    label: 'Hero Background',
    category: 'Images',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    node: {
      id: 'media-hero-1',
      type: 'image',
      props: { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', alt: 'Mountain landscape', width: 800, height: 600 },
      children: [],
      order: 0,
      parentId: null,
      design: {},
    } as PageNode,
  },
  {
    id: 'media-nature-1',
    label: 'Forest Path',
    category: 'Images',
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    node: {
      id: 'media-nature-1',
      type: 'image',
      props: { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop', alt: 'Forest path', width: 800, height: 600 },
      children: [],
      order: 1,
      parentId: null,
      design: {},
    } as PageNode,
  },
  {
    id: 'media-ocean-1',
    label: 'Ocean Waves',
    category: 'Images',
    src: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&h=600&fit=crop',
    node: {
      id: 'media-ocean-1',
      type: 'image',
      props: { src: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&h=600&fit=crop', alt: 'Ocean waves', width: 800, height: 600 },
      children: [],
      order: 2,
      parentId: null,
      design: {},
    } as PageNode,
  },
  {
    id: 'media-city-1',
    label: 'City Skyline',
    category: 'Images',
    src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
    node: {
      id: 'media-city-1',
      type: 'image',
      props: { src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop', alt: 'City skyline', width: 800, height: 600 },
      children: [],
      order: 3,
      parentId: null,
      design: {},
    } as PageNode,
  },
];
