import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Link, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  className,
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(value || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    onChange(url);
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleUrlChange(result);
      toast.success("Image uploaded successfully");
      setIsUploading(false);
    };

    reader.onerror = () => {
      toast.error("Failed to read file");
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const clearImage = () => {
    setImageUrl("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Image link
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Upload a photo</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="space-y-2">
            <Label>Upload an image from the device</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Choose an image"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {imageUrl && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Image Preview"
                  className="w-24 h-32 object-cover rounded-lg border"
                  onError={() => {
                    toast.error("Image loading failed");
                    clearImage();
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Image Preview</p>
                <p className="text-xs text-gray-500 break-all">
                  {imageUrl.startsWith("data:image/")
                    ? "uploaded image"
                    : imageUrl}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!imageUrl && (
        <Card className="mt-4">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="h-12 w-12 mb-2" />
              <p className="text-sm">No specific image</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
