export class EditLessonsAndEpisodesOrderDto {
  id: number;
  title?: string;
  isFree?: boolean;
  duration?: number;
  order?: number;
  episodes?: {
    id: number;
    title?: string;
    description?: string;
    duration?: number;
    videoUrl?: string;
    order?: number;
  }[];
}
