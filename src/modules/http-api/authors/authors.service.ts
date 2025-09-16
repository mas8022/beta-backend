import { Injectable } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { BucketService } from 'src/modules/services/bucket/bucket.service';
import { PrismaService } from 'src/modules/services/prisma/prisma.service';
import { EditCourseDto } from './dto/edit-course.dto';
import { EditLessonsAndEpisodesOrderDto } from './dto/edit-lessons-and-episodes-order.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { getVideoDurationInSeconds } from 'get-video-duration';
import { EditLessonDto } from './dto/edit-lesson.dto';
import { EpisodeDto } from './dto/episode.dto';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bucketService: BucketService,
  ) {}

  async getAuthorProfile(req: FastifyRequest) {
    const { id } = await req.author;

    const data = await this.prismaService.user.findUnique({
      where: { id },
      omit: {
        roles: true,
        createdAt: true,
        updatedAt: true,
      },
      include: {
        courses: {
          select: {
            status: true,
          },
        },
        _count: {
          select: {
            CourseComment: true,
            CourseOrder: {
              where: { status: 'success' },
            },
            Like: true,
          },
        },
      },
    });

    const coursesKindCount = data?.courses.reduce(
      (acc, course) => {
        if (course.status === 'publish') {
          acc.publishCoursesCount++;
        } else if (course.status === 'waiting') {
          acc.waitingCoursesCount++;
        } else {
          acc.creatingCoursesCount++;
        }
        return acc;
      },
      {
        publishCoursesCount: 0,
        waitingCoursesCount: 0,
        creatingCoursesCount: 0,
      },
    );

    return {
      status: 200,
      data: { ...data, coursesKindCount },
    };
  }

  async editProfile(files: any, { name, bio }: any, req: FastifyRequest) {
    const author = await req.author;

    let avatarAddress: string | null = null;
    if (files?.avatar?.[0]) {
      avatarAddress = await this.bucketService.uploadFile(files.avatar[0], [
        'image',
      ]);
    }

    const updateData: any = {
      name,
      bio,
    };

    if (avatarAddress) {
      updateData.avatar = avatarAddress;
    }

    await this.prismaService.user.update({
      where: {
        id: author.id,
      },
      data: updateData,
    });

    return {
      status: 200,
      message: 'ویرایش با موفقیت انجام شد',
    };
  }

  async getAuthorComments(req: FastifyRequest) {
    const author = await req.author;

    const comments = await this.prismaService.courseComment.findMany({
      where: {
        course: { authorId: author.id },
      },
      select: {
        id: true,
        text: true,
        course: {
          select: {
            title: true,
          },
        },
        reply: true,
        status: true,
        user: {
          select: {
            phone: true,
          },
        },
        createdAt: true,
      },
    });

    return {
      status: 200,
      data: comments,
    };
  }

  async confirmComment(commentId: string) {
    await this.prismaService.courseComment.update({
      where: { id: Number(commentId) },
      data: {
        status: 'confirm',
      },
    });

    return {
      status: 200,
      message: 'نظر تایید شد',
    };
  }

  async rejectComment(commentId: string) {
    await this.prismaService.courseComment.update({
      where: { id: Number(commentId) },
      data: {
        status: 'rejected',
      },
    });

    return {
      status: 200,
      message: 'نظر رد شد',
    };
  }

  async replyComment(commentId: string, replyText: string) {
    await this.prismaService.courseComment.update({
      where: { id: Number(commentId) },
      data: {
        reply: replyText,
      },
    });

    return {
      status: 200,
      message: 'پاسخ ارسال شد',
    };
  }

  async getAuthorCourses(req: FastifyRequest) {
    const { id } = await req.author;

    const courses = await this.prismaService.course.findMany({
      where: {
        authorId: id,
      },
      omit: {
        requirements: true,
        whatYouLearn: true,
      },
      include: {
        _count: {
          select: {
            lessons: true,
            CourseOrder: {
              where: {
                status: 'success',
              },
            },
          },
        },
      },
    });

    return {
      status: 200,
      data: courses,
    };
  }

  async createCourse(
    files: any,
    createCourseDto: CreateCourseDto,
    req: FastifyRequest,
  ) {
    const { category, title, description } = createCourseDto;

    const author = await req.author;

    const imageAddress: any = await this.bucketService.uploadFile(
      files.image[0],
      ['image'],
    );

    await this.prismaService.course.create({
      data: {
        authorId: author.id,
        category,
        title,
        description,
        image: imageAddress,
        price: 0,
        originalPrice: 0,
      },
    });

    return { status: 201, message: 'دوره با موفقیت ایجاد شد' };
  }

  async deleteCourse(courseId: string) {
    await this.prismaService.course.delete({
      where: {
        id: Number(courseId),
      },
    });

    return { status: 200, message: 'با موفقیت دوره حذف شد' };
  }

  async getOverViewCourse(courseId: string) {
    const cousre = await this.prismaService.course.findUnique({
      where: {
        id: Number(courseId),
      },

      select: {
        id: true,
        image: true,
        title: true,
        category: true,
        description: true,
        price: true,
        originalPrice: true,
        requirements: true,
        whatYouLearn: true,
      },
    });

    return { status: 200, data: cousre };
  }

  async editCourse(courseId: string, files: any, body: EditCourseDto) {
    const {
      title,
      description,
      category,
      originalPrice,
      price,
      requirements,
      whatYouLearn,
    } = body;

    let imageAddress: string | null = null;
    if (files?.image?.[0]) {
      imageAddress = await this.bucketService.uploadFile(files.image[0], [
        'image',
      ]);
    }

    const course = await this.prismaService.course.findUnique({
      where: {
        id: Number(courseId),
      },
      select: {
        image: true,
      },
    });

    const updateData: any = {
      title,
      description,
      category,
      originalPrice,
      price,
      requirements,
      whatYouLearn,
      status: 'waiting',
      image: imageAddress ?? course?.image,
    };

    await this.prismaService.course.update({
      where: {
        id: Number(courseId),
      },
      data: updateData,
    });

    return { status: 200, message: 'با موفقیت ویرایش شد' };
  }

  async getCourseLessons(courseId: string) {
    const lessons = await this.prismaService.course.findUnique({
      where: {
        id: Number(courseId),
      },

      select: {
        id: true,
        status: true,
        lessons: {
          include: {
            episodes: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return { status: 200, data: lessons };
  }

  async editLessonsAndEpisodesOrder(lessons: EditLessonsAndEpisodesOrderDto[]) {
    await this.prismaService.$transaction(
      lessons.flatMap((lesson) => [
        this.prismaService.lesson.update({
          where: { id: lesson.id },
          data: { order: lesson.order },
        }),
        ...(lesson.episodes?.map((ep) =>
          this.prismaService.episode.update({
            where: { id: ep.id },
            data: { order: ep.order },
          }),
        ) ?? []),
      ]),
    );

    return { status: 200, message: 'باموفقیت ترتیب عوض شد' };
  }

  async createLesson(courseId: string, body: CreateLessonDto) {
    const { title, isFree } = body;

    let lastOrder = await this.prismaService.lesson.count({
      where: {
        courseId: Number(courseId),
      },
    });

    await this.prismaService.lesson.create({
      data: {
        courseId: Number(courseId),
        title,
        isFree,
        order: lastOrder + 1,
      },
    });

    return { status: 201, message: 'فصل با موفقیت ایجاد شد' };
  }

  async deleteLesson(lessonId: string) {
    await this.prismaService.lesson.delete({
      where: {
        id: Number(lessonId),
      },
    });

    return { status: 200, message: 'فصل با موفقیت حذف شد' };
  }

  async editLesson(lessonId: string, editLessonDto: EditLessonDto) {
    const { title, isFree } = editLessonDto;

    await this.prismaService.lesson.update({
      where: {
        id: Number(lessonId),
      },
      data: {
        title,
        isFree,
        status: 'waiting',
      },
    });

    return { status: 201, message: 'فصل با موفقیت ویرایش شد' };
  }

  async createEpisode(lessonId: string, files: any, body: EpisodeDto) {
    const { title, description } = body;

    const lastOrder = await this.prismaService.episode.count({
      where: {
        lessonId: Number(lessonId),
      },
    });

    const videoAddress: any = await this.bucketService.uploadFile(
      files.video[0],
      ['video'],
    );

    const duration = await getVideoDurationInSeconds(videoAddress).then(
      (result) => Math.round(result),
    );

    await this.prismaService.episode.create({
      data: {
        lessonId: Number(lessonId),
        title,
        order: lastOrder + 1,
        videoUrl: videoAddress,
        description,
        duration,
      },
    });

    return { status: 201, message: 'درس با موفقیت ایجاد شد' };
  }

  async deleteEpisode(episodeId: string) {
    await this.prismaService.episode.delete({
      where: {
        id: Number(episodeId),
      },
    });

    return { status: 200, message: 'درس با موفقیت حذف شد' };
  }

  async editEpisode(
    episodeId: string,
    editEpisodeDto: EpisodeDto,
    files?: any,
  ) {
    const { title, description } = editEpisodeDto;

    const oldEpisode = await this.prismaService.episode.findUnique({
      where: { id: Number(episodeId) },
    });

    if (!oldEpisode) {
      return { status: 404, message: 'اپیزود یافت نشد' };
    }

    let videoUrl: any = oldEpisode.videoUrl;
    let duration: any = oldEpisode.duration;
    if (files?.video?.[0]) {
      videoUrl = await this.bucketService.uploadFile(files.video[0], ['video']);
      duration = await getVideoDurationInSeconds(videoUrl).then((res) =>
        Math.round(res),
      );
    }

    await this.prismaService.episode.update({
      where: { id: Number(episodeId) },
      data: {
        title,
        description,
        videoUrl,
        duration,
      },
    });

    return { status: 201, message: 'اپیزود با موفقیت ویرایش شد' };
  }
}
