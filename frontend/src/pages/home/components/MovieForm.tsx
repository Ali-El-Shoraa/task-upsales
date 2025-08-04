import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCreateMovie, useUpdateMovie } from "@/store/useMoviesStore";
import type { Movie, MovieFormProps } from "@/types/type";
import ImageUpload from "./ImageUpload";
import { Loader2 } from "lucide-react";

const movieTypes = [
  { value: "Movie", label: "Movies" },
  { value: "TV_Show", label: "Series" },
];

export default function MovieForm({
  isOpen,
  onClose,
  movie,
  mode,
}: MovieFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: "",
    posterUrl: "",
  });

  const createMovieMutation = useCreateMovie();
  const updateMovieMutation = useUpdateMovie();

  const isLoading =
    createMovieMutation.isPending || updateMovieMutation.isPending;

  useEffect(() => {
    if (mode === "edit" && movie) {
      setFormData({
        title: movie.title || "",
        type: movie.type || "",
        director: movie.director || "",
        budget: movie.budget?.toString() || "",
        location: movie.location || "",
        duration: movie.duration?.toString() || "",
        year: movie.year?.toString() || "",
        posterUrl: movie.posterUrl || "",
      });
    } else {
      setFormData({
        title: "",
        type: "",
        director: "",
        budget: "",
        location: "",
        duration: "",
        year: "",
        posterUrl: "",
      });
    }
  }, [mode, movie, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    const movieData = {
      ...formData,
      budget: formData.budget ? Number(formData.budget) : 0,
      duration: formData.duration ? Number(formData.duration) : 0,
      year: formData.year ? Number(formData.year) : new Date().getFullYear(),
    };

    try {
      if (mode === "create") {
        await createMovieMutation.mutateAsync(movieData);
      } else if (mode === "edit" && movie) {
        await updateMovieMutation.mutateAsync({
          ...movieData,
          id: movie.id,
          createdAt: movie.createdAt,
        } as Movie);
      }
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add a new movie" : "movie editing"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter the movie title"
              required
            />
          </div>

          {/* Type , director*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select the movie type" />
                </SelectTrigger>
                <SelectContent>
                  {movieTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="director">Director</Label>
              <Input
                id="director"
                value={formData.director}
                onChange={(e) => handleInputChange("director", e.target.value)}
                placeholder="director name"
              />
            </div>
          </div>

          {/* Budget, duration, year */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (in minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="120"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear() + 5}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Filming location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Filming location"
            />
          </div>

          {/* Uploade Image */}
          <div className="space-y-2">
            <Label>Image Show</Label>
            <ImageUpload
              value={formData.posterUrl}
              onChange={(url) => handleInputChange("posterUrl", url)}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Canceled
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Add movie" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
