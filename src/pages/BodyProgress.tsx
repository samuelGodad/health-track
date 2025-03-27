
import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarIcon,
  ImageIcon,
  VideoIcon,
  UploadIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  AlertCircleIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { supabase } from "@/integrations/supabase/client";

// Photo types
const PHOTO_TYPES = [
  'front relaxed',
  'side relaxed (right)',
  'back relaxed',
  'side relaxed (left)',
  'front lat spread',
  'front double bicep',
  'side chest',
  'side tricep',
  'back lat spread',
  'back double bicep',
  'abs & thighs',
  'most muscular'
];

// Mock data for progress photos
const mockPhotos = [
  { 
    id: 1, 
    date: '2023-07-01', 
    type: 'front relaxed', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 2, 
    date: '2023-07-01', 
    type: 'side relaxed (right)', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 3, 
    date: '2023-07-01', 
    type: 'back relaxed', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 4, 
    date: '2023-06-01', 
    type: 'front relaxed', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 5, 
    date: '2023-06-01', 
    type: 'side relaxed (right)', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 6, 
    date: '2023-06-01', 
    type: 'back relaxed', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
];

// Mock data for progress videos
const mockVideos = [
  {
    id: 1,
    date: '2023-07-01',
    title: 'Monthly Progress Video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
    videoUrl: 'https://example.com/video1.mp4'
  },
  {
    id: 2,
    date: '2023-06-01',
    title: 'Monthly Progress Video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
    videoUrl: 'https://example.com/video2.mp4'
  }
];

// Group photos by month
const groupedPhotos = mockPhotos.reduce((acc, photo) => {
  const month = photo.date.substring(0, 7); // Extract YYYY-MM
  if (!acc[month]) {
    acc[month] = [];
  }
  acc[month].push(photo);
  return acc;
}, {} as Record<string, typeof mockPhotos>);

// Group videos by month
const groupedVideos = mockVideos.reduce((acc, video) => {
  const month = video.date.substring(0, 7); // Extract YYYY-MM
  if (!acc[month]) {
    acc[month] = [];
  }
  acc[month].push(video);
  return acc;
}, {} as Record<string, typeof mockVideos>);

const monthsWithPhotos = Object.keys(groupedPhotos).sort().reverse();
const monthsWithVideos = Object.keys(groupedVideos).sort().reverse();

const BodyProgress = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [photoType, setPhotoType] = useState<string>(PHOTO_TYPES[0]);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [photoFilterType, setPhotoFilterType] = useState<string>('all');
  const [selectedPhotoMonth, setSelectedPhotoMonth] = useState<string>(monthsWithPhotos[0] || '');
  const [selectedVideoMonth, setSelectedVideoMonth] = useState<string>(monthsWithVideos[0] || '');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [uploadTab, setUploadTab] = useState<string>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);

  const filteredPhotos = selectedPhotoMonth
    ? groupedPhotos[selectedPhotoMonth].filter(photo => photoFilterType === 'all' || photo.type === photoFilterType)
    : [];

  const filteredVideos = selectedVideoMonth
    ? groupedVideos[selectedVideoMonth]
    : [];

  const handleImageClick = (url: string) => {
    setPreviewImage(url);
  };

  const handleVideoClick = (url: string) => {
    setPreviewVideo(url);
  };

  const closePreview = () => {
    setPreviewImage(null);
    setPreviewVideo(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create and set preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setLocalImagePreview(objectUrl);
      
      // Clean up the object URL when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!user) {
      toast.error('You must be logged in to upload images');
      return;
    }
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    try {
      setIsUploading(true);
      
      const formattedDate = format(date, 'yyyy-MM-dd');
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${user.id}/${formattedDate}/${photoType.replace(/\s/g, '-')}.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('progress-images')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      console.log('Upload successful:', data);
      
      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('progress-images')
        .getPublicUrl(filePath);
      
      toast.success(`${mediaType === 'photo' ? 'Photo' : 'Video'} uploaded successfully`);
      
      // Reset form
      setSelectedFile(null);
      setLocalImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Error uploading:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 md:px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Body Progress</h1>
            <p className="text-muted-foreground">Track your physical transformation over time</p>
          </div>
          
          <Button 
            className="flex items-center gap-2"
            onClick={() => setUploadTab('upload')}
          >
            <UploadIcon className="h-4 w-4" />
            <span>Upload New Media</span>
          </Button>
        </div>
        
        <Card className="mb-8 border border-border/50 bg-card/90 backdrop-blur-sm">
          <Tabs value={uploadTab} onValueChange={setUploadTab}>
            <div className="p-4 pb-0 border-b">
              <TabsList className="mb-0">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="measurements">Measurements</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="upload" className="mt-0">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 space-y-4">
                    <div>
                      <Label htmlFor="media-type" className="mb-2 block">Media Type</Label>
                      <Select value={mediaType} onValueChange={(value) => setMediaType(value as 'photo' | 'video')}>
                        <SelectTrigger id="media-type">
                          <SelectValue placeholder="Select media type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="photo">Photo</SelectItem>
                          <SelectItem value="video">Video (60s max)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="date" className="mb-2 block">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => date && setDate(date)}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {mediaType === 'photo' && (
                      <div>
                        <Label htmlFor="photo-type" className="mb-2 block">Photo Type</Label>
                        <Select value={photoType} onValueChange={setPhotoType}>
                          <SelectTrigger id="photo-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {PHOTO_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {mediaType === 'video' && (
                      <div>
                        <Label htmlFor="video-title" className="mb-2 block">Title</Label>
                        <Input
                          id="video-title"
                          placeholder="Monthly Progress Video"
                        />
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                          <AlertCircleIcon className="h-3 w-3 mr-1" />
                          Maximum video length: 60 seconds
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="media-file" className="mb-2 block">
                        Upload {mediaType === 'photo' ? 'Photo' : 'Video'}
                      </Label>
                      <div className="grid gap-2">
                        <Input
                          id="media-file"
                          type="file"
                          accept={mediaType === 'photo' ? "image/*" : "video/*"}
                          className="cursor-pointer"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                        <Button 
                          className="w-full" 
                          onClick={handleUpload}
                          disabled={isUploading || !selectedFile}
                        >
                          {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-2/3 border border-border/50 rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center justify-center h-full">
                      {localImagePreview ? (
                        <div className="w-full h-full aspect-square">
                          <img 
                            src={localImagePreview} 
                            alt="Selected preview" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-center flex flex-col items-center">
                          {mediaType === 'photo' ? (
                            <>
                              <ImageIcon className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                              <h3 className="text-lg font-medium">No Preview Available</h3>
                              <p className="text-sm text-muted-foreground">
                                Upload a new photo or select an existing one to preview
                              </p>
                            </>
                          ) : (
                            <>
                              <VideoIcon className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                              <h3 className="text-lg font-medium">No Video Preview Available</h3>
                              <p className="text-sm text-muted-foreground">
                                Upload a new video or select an existing one to preview
                              </p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="measurements" className="mt-0">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="measurement-date" className="mb-2 block">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="measurement-date"
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => date && setDate(date)}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label htmlFor="weight" className="mb-2 block">Weight (kg)</Label>
                      <Input id="weight" type="number" placeholder="80.5" />
                    </div>
                    
                    <div>
                      <Label htmlFor="body-fat" className="mb-2 block">Body Fat %</Label>
                      <Input id="body-fat" type="number" placeholder="15" />
                    </div>
                    
                    <div>
                      <Label htmlFor="chest" className="mb-2 block">Chest (cm)</Label>
                      <Input id="chest" type="number" placeholder="100" />
                    </div>
                    
                    <div>
                      <Label htmlFor="waist" className="mb-2 block">Waist (cm)</Label>
                      <Input id="waist" type="number" placeholder="80" />
                    </div>
                    
                    <div>
                      <Label htmlFor="hips" className="mb-2 block">Hips (cm)</Label>
                      <Input id="hips" type="number" placeholder="95" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="left-arm" className="mb-2 block">Left Arm (cm)</Label>
                      <Input id="left-arm" type="number" placeholder="35" />
                    </div>
                    
                    <div>
                      <Label htmlFor="right-arm" className="mb-2 block">Right Arm (cm)</Label>
                      <Input id="right-arm" type="number" placeholder="35" />
                    </div>
                    
                    <div>
                      <Label htmlFor="left-thigh" className="mb-2 block">Left Thigh (cm)</Label>
                      <Input id="left-thigh" type="number" placeholder="55" />
                    </div>
                    
                    <div>
                      <Label htmlFor="right-thigh" className="mb-2 block">Right Thigh (cm)</Label>
                      <Input id="right-thigh" type="number" placeholder="55" />
                    </div>
                    
                    <div>
                      <Label htmlFor="left-calf" className="mb-2 block">Left Calf (cm)</Label>
                      <Input id="left-calf" type="number" placeholder="38" />
                    </div>
                    
                    <div>
                      <Label htmlFor="right-calf" className="mb-2 block">Right Calf (cm)</Label>
                      <Input id="right-calf" type="number" placeholder="38" />
                    </div>
                    
                    <Button className="w-full mt-4">Save Measurements</Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">Progress Media Gallery</h2>
            
            <div className="flex flex-col md:flex-row gap-3">
              <Tabs defaultValue="photos" className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="photos" onClick={() => setMediaType('photo')}>Photos</TabsTrigger>
                  <TabsTrigger value="videos" onClick={() => setMediaType('video')}>Videos</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {mediaType === 'photo' && (
                <div className="flex gap-3">
                  <Select value={photoFilterType} onValueChange={setPhotoFilterType}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {PHOTO_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-none"
                      onClick={() => {
                        const currentIndex = monthsWithPhotos.indexOf(selectedPhotoMonth);
                        if (currentIndex < monthsWithPhotos.length - 1) {
                          setSelectedPhotoMonth(monthsWithPhotos[currentIndex + 1]);
                        }
                      }}
                      disabled={monthsWithPhotos.indexOf(selectedPhotoMonth) === monthsWithPhotos.length - 1}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Select value={selectedPhotoMonth} onValueChange={setSelectedPhotoMonth}>
                      <SelectTrigger className="rounded-none border-l-0 border-r-0 w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {monthsWithPhotos.map(month => (
                          <SelectItem key={month} value={month}>
                            {format(new Date(month), 'MMMM yyyy')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-none"
                      onClick={() => {
                        const currentIndex = monthsWithPhotos.indexOf(selectedPhotoMonth);
                        if (currentIndex > 0) {
                          setSelectedPhotoMonth(monthsWithPhotos[currentIndex - 1]);
                        }
                      }}
                      disabled={monthsWithPhotos.indexOf(selectedPhotoMonth) === 0}
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {mediaType === 'video' && (
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    onClick={() => {
                      const currentIndex = monthsWithVideos.indexOf(selectedVideoMonth);
                      if (currentIndex < monthsWithVideos.length - 1) {
                        setSelectedVideoMonth(monthsWithVideos[currentIndex + 1]);
                      }
                    }}
                    disabled={monthsWithVideos.indexOf(selectedVideoMonth) === monthsWithVideos.length - 1}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Select value={selectedVideoMonth} onValueChange={setSelectedVideoMonth}>
                    <SelectTrigger className="rounded-none border-l-0 border-r-0 w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {monthsWithVideos.map(month => (
                        <SelectItem key={month} value={month}>
                          {format(new Date(month), 'MMMM yyyy')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    onClick={() => {
                      const currentIndex = monthsWithVideos.indexOf(selectedVideoMonth);
                      if (currentIndex > 0) {
                        setSelectedVideoMonth(monthsWithVideos[currentIndex - 1]);
                      }
                    }}
                    disabled={monthsWithVideos.indexOf(selectedVideoMonth) === 0}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="grid" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="comparison">Comparison View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid" className="mt-0">
              {mediaType === 'photo' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPhotos.map(photo => (
                    <div 
                      key={photo.id} 
                      className="relative overflow-hidden rounded-lg shadow-sm border border-border/50 group"
                      onClick={() => handleImageClick(photo.url)}
                    >
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                        <Button variant="secondary" className="bg-white/80">View</Button>
                      </div>
                      <div className="aspect-square">
                        <img
                          src={photo.url}
                          alt={`${photo.type} view on ${photo.date}`}
                          className="object-cover w-full h-full aspect-square"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="capitalize">{photo.type}</span>
                          <span>{format(new Date(photo.date), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredPhotos.length === 0 && (
                    <div className="col-span-full p-10 text-center border border-dashed border-border rounded-lg">
                      <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
                      <h3 className="text-lg font-medium">No photos found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try changing your filter or upload new photos
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map(video => (
                    <div 
                      key={video.id} 
                      className="relative overflow-hidden rounded-lg shadow-sm border border-border/50 group"
                      onClick={() => handleVideoClick(video.videoUrl)}
                    >
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                        <Button variant="secondary" className="bg-white/80">Play</Button>
                      </div>
                      <div className="aspect-video">
                        <img
                          src={video.thumbnailUrl}
                          alt={`${video.title} on ${video.date}`}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded-full bg-black/50 p-3">
                            <VideoIcon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span>{video.title}</span>
                          <span>{format(new Date(video.date), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredVideos.length === 0 && (
                    <div className="col-span-full p-10 text-center border border-dashed border-border rounded-lg">
                      <VideoIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
                      <h3 className="text-lg font-medium">No videos found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try changing your filter or upload new videos
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="comparison" className="mt-0">
              <div className="border border-border rounded-lg p-6 text-center bg-muted/30">
                <div className="max-w-md mx-auto">
                  {mediaType === 'photo' ? (
                    <>
                      <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
                      <h3 className="text-lg font-medium mb-2">Compare Your Progress</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select photos from different time periods to see your transformation
                      </p>
                    </>
                  ) : (
                    <>
                      <VideoIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
                      <h3 className="text-lg font-medium mb-2">Compare Videos</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select videos from different time periods to compare your progress
                      </p>
                    </>
                  )}
                  <Button className="mx-auto">Create Comparison</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {previewImage && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closePreview}>
            <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-2 right-2 bg-black/50 text-white border-none hover:bg-black/70 z-10" 
                onClick={closePreview}
              >
                ×
              </Button>
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
        
        {previewVideo && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closePreview}>
            <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-2 right-2 bg-black/50 text-white border-none hover:bg-black/70 z-10" 
                onClick={closePreview}
              >
                ×
              </Button>
              <video 
                src={previewVideo}
                controls
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BodyProgress;
