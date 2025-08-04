import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cloudinary from "../libs/cloudinary";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  userId?: number;
}

const handleImageUpload = async (posterUrl: string): Promise<string> => {
  // إذا كانت الصورة base64، ارفعها إلى Cloudinary
  if (posterUrl && posterUrl.startsWith("data:image/")) {
    try {
      const uploadResult = await cloudinary.uploader.upload(posterUrl, {
        folder: "movies",
        transformation: [
          { width: 800, height: 1200, crop: "limit" },
          { quality: "auto" },
          { format: "auto" },
        ],
      });
      return uploadResult.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      // في حالة فشل الرفع، احتفظ بـ base64 كـ fallback
      return posterUrl;
    }
  }
  // إذا كانت URL عادي، أرجعه كما هو
  return posterUrl;
};

export const getUserMovies = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const {
      page = "1",
      limit = "10",
      search = "",
      type = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = Math.max(1, Number.parseInt(page as string));
    const limitNum = Math.max(
      1,
      Math.min(100, Number.parseInt(limit as string))
    );
    const skip = (pageNum - 1) * limitNum;

    const whereConditions: any = {
      userId: req.userId,
    };

    if (search && search.toString().trim()) {
      const searchTerm = search.toString().trim();
      whereConditions.OR = [
        {
          title: {
            contains: searchTerm,
            // mode: "insensitive",
          },
        },
        {
          director: {
            contains: searchTerm,
            // mode: "insensitive",
          },
        },
      ];
    }

    if (type && type.toString().trim()) {
      const typeValue = type.toString().trim();
      if (typeValue === "Movie" || typeValue === "TV_Show") {
        whereConditions.type = typeValue;
      }
    }

    const orderBy: any = {};
    const validSortFields = ["title", "year", "createdAt", "type", "director"];
    const sortField = validSortFields.includes(sortBy as string)
      ? sortBy
      : "createdAt";
    const order = sortOrder === "asc" ? "asc" : "desc";
    orderBy[sortField as string] = order;

    const [movies, totalCount] = await Promise.all([
      prisma.movie.findMany({
        where: whereConditions,
        skip,
        take: limitNum,
        orderBy,
        select: {
          id: true,
          title: true,
          type: true,
          director: true,
          budget: true,
          location: true,
          duration: true,
          year: true,
          posterUrl: true,
          createdAt: true,
        },
      }),
      prisma.movie.count({
        where: whereConditions,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    return res.json({
      message: "Movies fetched successfully",
      data: movies,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        search: search?.toString() || "",
        type: type?.toString() || "",
        sortBy: sortField,
        sortOrder: order,
      },
    });
  } catch (error) {
    console.error("Error getting movies:", error);
    return res.status(500).json({
      message: "Failed to fetch movies",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const addMovie = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      type,
      director,
      budget,
      location,
      duration,
      year,
      posterUrl,
    } = req.body;

    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    // معالجة رفع الصورة إلى Cloudinary
    const processedPosterUrl = posterUrl
      ? await handleImageUpload(posterUrl)
      : null;

    const movie = await prisma.movie.create({
      data: {
        title,
        type,
        director,
        budget,
        location,
        duration,
        year,
        posterUrl: processedPosterUrl,
        userId: req.userId,
      },
    });

    return res.status(201).json({
      message: "Movie added successfully",
      data: movie,
    });
  } catch (error) {
    console.error("Error adding movie:", error);
    return res.status(500).json({ message: "Failed to add movie" });
  }
};

export const updateMovie = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const movieId = Number(req.params.id);
    const updateData = req.body;

    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie || movie.userId !== req.userId) {
      return res.status(403).json({ message: "Forbidden: Not your movie" });
    }

    // معالجة رفع الصورة إلى Cloudinary إذا تم تغييرها
    if (updateData.posterUrl && updateData.posterUrl !== movie.posterUrl) {
      updateData.posterUrl = await handleImageUpload(updateData.posterUrl);
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: movieId },
      data: updateData,
    });

    return res.status(200).json({
      message: "Movie updated successfully",
      data: updatedMovie,
    });
  } catch (error) {
    console.error("Error updating movie:", error);
    return res.status(500).json({ message: "Failed to update movie" });
  }
};

export const deleteMovie = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const movieId = Number(req.params.id);

    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie || movie.userId !== req.userId) {
      return res.status(403).json({ message: "Forbidden: Not your movie" });
    }

    // حذف الصورة من Cloudinary إذا كانت مرفوعة هناك
    if (movie.posterUrl && movie.posterUrl.includes("cloudinary.com")) {
      try {
        // استخراج public_id من URL
        const urlParts = movie.posterUrl.split("/");
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = `movies/${publicIdWithExtension.split(".")[0]}`;

        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // لا نوقف العملية إذا فشل حذف الصورة
      }
    }

    await prisma.movie.delete({ where: { id: movieId } });

    return res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return res.status(500).json({ message: "Failed to delete movie" });
  }
};
