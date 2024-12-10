"use client";

import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import Cropper from "react-easy-crop";
import { useProfile } from "@/hooks/useProfile";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@radix-ui/react-avatar";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  avatar: z.instanceof(File).optional(),
});

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ProfileSettingsForm = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [existingAvatar, setExistingAvatar] = useState<boolean>(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null,
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);

  const { profile } = useProfile();
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
    },
  });

  useEffect(() => {
    const getProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", profile?.id)
        .single();
      if (!error) {
        form.setValue("displayName", data?.display_name);
        if (data?.avatar_url) {
          const response = await fetch(data.avatar_url);
          const blob = await response.blob();
          const file = new File([blob], "avatar.png", { type: "image/png" });
          setExistingAvatar(true);
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            form.setValue("avatar", file);
          }
        }
      }
    };

    if (profile) {
      getProfile();
    }
  }, [profile]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // First upload the picture to supabase storage and get the url
    const avatar = croppedImage ? croppedImage : values.avatar;
    if (avatar) {
      if (existingAvatar) {
        const { data, error } = await supabase.storage
          .from("avatars")
          .update(`${profile?.id}.png`, avatar);
        if (error) {
          console.error(error);
          toast({
            title: "Error",
            description: "Failed to update avatar",
            variant: "destructive",
          });
          return;
        }
      } else {
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(`${profile?.id}.png`, avatar);
        if (error) {
          console.error(error);
          toast({
            title: "Error",
            description: "Failed to upload avatar",
            variant: "destructive",
          });
          return;
        }
        console.log(data);
      }
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(`${profile?.id}.png`);
      const avatarUrl = data?.publicUrl;

      const { data: avatarUrlData, error: avatarUrlError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", profile?.id);
      if (avatarUrlError) {
        console.error(avatarUrlError);
        toast({
          title: "Error",
          description: "Failed to update avatar url",
          variant: "destructive",
        });
        return;
      }
    }
    if (values.displayName) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ display_name: values.displayName })
        .eq("id", profile?.id);
      if (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to update display name",
          variant: "destructive",
        });
        return;
      }
    }
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });

    // then update the profile with the new display name and avatar url
  };

  const onCropComplete = useCallback(
    (croppedArea: CropArea, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
      form.setValue("avatar", file);
    }
  };

  const handleCropSave = useCallback(async () => {
    if (avatarPreview && croppedAreaPixels) {
      const croppedImageUrl = await getCroppedImg(
        avatarPreview,
        croppedAreaPixels,
      );
      const resizedImageUrl = await resizeImage(croppedImageUrl, 512, 512);
      setAvatarPreview(resizedImageUrl);
      // Convert the cropped image URL to a File object
      const response = await fetch(resizedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "cropped-avatar.png", {
        type: "image/png",
      });

      setCroppedImage(file);
      form.setValue("avatar", file);
      setCropperOpen(false);
    }
  }, [avatarPreview, croppedAreaPixels, form]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your display name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={avatarPreview || "/placeholder.svg?height=80&width=80"}
                alt="Avatar preview"
              />
              <AvatarFallback>
                {form
                  .watch("displayName")
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium">
                {form.watch("displayName") || "Display Name"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={cropperOpen} onOpenChange={setCropperOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crop Avatar</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-64">
            {avatarPreview && (
              <Cropper
                image={avatarPreview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className="py-4">
            <Label htmlFor="zoom">Zoom</Label>
            <Slider
              id="zoom"
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
            />
          </div>
          <Button onClick={handleCropSave}>Save</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: CropArea,
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("Canvas is empty");
      }
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
};

const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
};

const resizeImage = async (
  imageSrc: string,
  maxWidth: number,
  maxHeight: number,
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  let width = image.width;
  let height = image.height;

  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("Canvas is empty");
      }
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
};
