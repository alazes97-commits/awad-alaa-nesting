import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      return;
    }

    setUploading(true);
    const newImageUrls: string[] = [];

    try {
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          continue;
        }

        // Convert to base64 data URL for now (in a real app, you'd upload to a server)
        const dataUrl = await fileToDataUrl(file);
        newImageUrls.push(dataUrl);
      }

      onImagesChange([...images, ...newImageUrls]);
      
      if (newImageUrls.length > 0) {
      }
    } catch (error) {
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{t('recipeImagesUpload')}</label>
        <span className="text-xs text-muted-foreground">
          {images.length}/{maxImages} {t('images')}
        </span>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="relative group overflow-hidden">
            <CardContent className="p-0">
              <img
                src={image}
                alt={`Recipe image ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                data-testid={`remove-image-${index}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Upload Button */}
        {images.length < maxImages && (
          <Card 
            className="border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer"
            onClick={triggerFileSelect}
          >
            <CardContent className="flex flex-col items-center justify-center h-32 text-muted-foreground hover:text-primary transition-colors">
              {uploading ? (
                <div className="animate-spin">
                  <Upload className="w-6 h-6" />
                </div>
              ) : (
                <>
                  <ImageIcon className="w-6 h-6 mb-2" />
                  <span className="text-xs text-center">{t('addImage')}</span>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        data-testid="image-upload-input"
      />

      {/* Upload Info */}
      <p className="text-xs text-muted-foreground">
        {t('imageUploadInfo')}
      </p>
    </div>
  );
}