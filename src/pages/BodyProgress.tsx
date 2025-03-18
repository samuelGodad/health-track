
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarIcon,
  ImageIcon,
  UploadIcon,
  ChevronRightIcon,
  ChevronLeftIcon
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

// Mock data for progress photos
const mockPhotos = [
  { 
    id: 1, 
    date: '2023-07-01', 
    type: 'front', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 2, 
    date: '2023-07-01', 
    type: 'side', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 3, 
    date: '2023-07-01', 
    type: 'back', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 4, 
    date: '2023-06-01', 
    type: 'front', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 5, 
    date: '2023-06-01', 
    type: 'side', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 6, 
    date: '2023-06-01', 
    type: 'back', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 7, 
    date: '2023-05-01', 
    type: 'front', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 8, 
    date: '2023-05-01', 
    type: 'side', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 9, 
    date: '2023-05-01', 
    type: 'back', 
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' 
  },
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

const monthsWithPhotos = Object.keys(groupedPhotos).sort().reverse();

const BodyProgress = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [photoType, setPhotoType] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(monthsWithPhotos[0] || '');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredPhotos = selectedMonth
    ? groupedPhotos[selectedMonth].filter(photo => photoType === 'all' || photo.type === photoType)
    : [];

  const handleImageClick = (url: string) => {
    setPreviewImage(url);
  };

  const closePreview = () => {
    setPreviewImage(null);
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
          
          <Button className="flex items-center gap-2">
            <UploadIcon className="h-4 w-4" />
            <span>Upload New Photos</span>
          </Button>
        </div>
        
        <Card className="mb-8 border border-border/50 bg-card/90 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 space-y-4">
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
                
                <div>
                  <Label htmlFor="photo-type" className="mb-2 block">Photo Type</Label>
                  <Select value="front" onValueChange={() => {}}>
                    <SelectTrigger id="photo-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="front">Front View</SelectItem>
                      <SelectItem value="back">Back View</SelectItem>
                      <SelectItem value="side">Side View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="photo-file" className="mb-2 block">Upload Photo</Label>
                  <div className="grid gap-2">
                    <Input
                      id="photo-file"
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                    />
                    <Button className="w-full">Upload</Button>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-2/3 border border-border/50 rounded-lg p-4 bg-muted/30">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center flex flex-col items-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-medium">No Preview Available</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a new photo or select an existing one to preview
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">Progress Timeline</h2>
            
            <div className="flex items-center gap-3">
              <Select value={photoType} onValueChange={setPhotoType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="front">Front View</SelectItem>
                  <SelectItem value="back">Back View</SelectItem>
                  <SelectItem value="side">Side View</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => {
                    const currentIndex = monthsWithPhotos.indexOf(selectedMonth);
                    if (currentIndex < monthsWithPhotos.length - 1) {
                      setSelectedMonth(monthsWithPhotos[currentIndex + 1]);
                    }
                  }}
                  disabled={monthsWithPhotos.indexOf(selectedMonth) === monthsWithPhotos.length - 1}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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
                    const currentIndex = monthsWithPhotos.indexOf(selectedMonth);
                    if (currentIndex > 0) {
                      setSelectedMonth(monthsWithPhotos[currentIndex - 1]);
                    }
                  }}
                  disabled={monthsWithPhotos.indexOf(selectedMonth) === 0}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="grid" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="comparison">Comparison View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid" className="mt-0">
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
            </TabsContent>
            
            <TabsContent value="comparison" className="mt-0">
              <div className="border border-border rounded-lg p-6 text-center bg-muted/30">
                <div className="max-w-md mx-auto">
                  <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
                  <h3 className="text-lg font-medium mb-2">Compare Your Progress</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select photos from different time periods to see your transformation
                  </p>
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
      </main>
    </div>
  );
};

export default BodyProgress;
