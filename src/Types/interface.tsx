// Define types for the objects coming from the /photos endpoint
interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
}

// Define types for the objects coming from the /photos/{imageId} endpoint
interface UnsplashPhotoDetail extends UnsplashPhoto {
  downloads: number;
  likes: number;
  views: number;
}
