import React from 'react';
import { useUpload } from '@/contexts/UploadContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  UploadIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertCircleIcon, 
  Loader2Icon,
  XIcon,
  RefreshCwIcon
} from 'lucide-react';

const GlobalUploadStatus: React.FC = () => {
  const { uploads, isUploading, isProcessing, retryUpload, removeUpload, clearUploads } = useUpload();

  // Only show if there are uploads
  if (uploads.length === 0) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <UploadIcon className="h-4 w-4 text-muted-foreground" />;
      case 'uploading':
        return <Loader2Icon className="h-4 w-4 animate-spin text-blue-500" />;
      case 'processing':
        return <Loader2Icon className="h-4 w-4 animate-spin text-orange-500" />;
      case 'success':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case 'duplicate':
        return <AlertCircleIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <UploadIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'success':
        return 'Completed';
      case 'error':
        return 'Failed';
      case 'duplicate':
        return 'Duplicate';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-muted-foreground';
      case 'uploading':
        return 'text-blue-500';
      case 'processing':
        return 'text-orange-500';
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'duplicate':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const activeUploads = uploads.filter(u => 
    u.status === 'pending' || u.status === 'uploading' || u.status === 'processing'
  );

  const completedUploads = uploads.filter(u => 
    u.status === 'success' || u.status === 'error' || u.status === 'duplicate'
  );

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg border-2 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <UploadIcon className="h-4 w-4" />
              File Uploads
              {(isUploading || isProcessing) && (
                <Loader2Icon className="h-4 w-4 animate-spin text-blue-500" />
              )}
            </h3>
            <div className="flex gap-1">
              {completedUploads.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearUploads}
                  className="h-6 px-2 text-xs"
                >
                  Clear
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeUpload('all')}
                className="h-6 px-2 text-xs"
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Active uploads */}
          {activeUploads.length > 0 && (
            <div className="space-y-2 mb-3">
              <p className="text-xs text-muted-foreground font-medium">In Progress</p>
              {activeUploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getStatusIcon(upload.status)}
                    <span className="truncate">{upload.name}</span>
                  </div>
                  <span className={`text-xs font-medium ${getStatusColor(upload.status)}`}>
                    {getStatusText(upload.status)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Completed uploads */}
          {completedUploads.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Completed</p>
              {completedUploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getStatusIcon(upload.status)}
                    <span className="truncate">{upload.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-medium ${getStatusColor(upload.status)}`}>
                      {getStatusText(upload.status)}
                    </span>
                    {upload.status === 'error' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => retryUpload(upload.id)}
                        className="h-5 w-5 p-0"
                      >
                        <RefreshCwIcon className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUpload(upload.id)}
                      className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="mt-3 pt-2 border-t text-xs text-muted-foreground">
            {activeUploads.length > 0 && (
              <span className="mr-2">
                {activeUploads.length} active
              </span>
            )}
            {completedUploads.length > 0 && (
              <span>
                {completedUploads.filter(u => u.status === 'success').length} completed
                {completedUploads.filter(u => u.status === 'error').length > 0 && (
                  <span className="text-red-500 ml-1">
                    {completedUploads.filter(u => u.status === 'error').length} failed
                  </span>
                )}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalUploadStatus;
