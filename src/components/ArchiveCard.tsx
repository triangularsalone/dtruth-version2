interface ArchiveCardProps {
  id?: string;
  title: string;
  description?: string;
  date: string;
  category?: string;
  fileType?: string;
  mediaUrl?: string;
  fileSize?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const isImageUrl = (url?: string) => !!url && /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(url)
const isVideoUrl = (url?: string) => !!url && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)

export default function ArchiveCard({
  id,
  title,
  description,
  date,
  category,
  fileType,
  mediaUrl,
  fileSize,
  onView,
  onEdit,
  onDelete
}: ArchiveCardProps) {
  const getFileIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5 2H15.5L19 5.5V22H5V2H8.5ZM15 3.5V7H18.5L15 3.5ZM7 4V20H17V9H13V4H7ZM9 12H11V18H9V12ZM13 10H15V18H13V10Z"/>
          </svg>
        );
      case 'doc':
      case 'docx':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M18 20H6V4H13V9H18V20Z"/>
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'avif':
        return (
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const renderMediaPreview = () => {
    if (!mediaUrl) return null;

    if (isVideoUrl(mediaUrl)) {
      return (
        <div className="mb-4 overflow-hidden rounded-3xl bg-slate-950">
          <video
            src={mediaUrl}
            controls
            className="w-full h-56 object-cover rounded-3xl"
          />
        </div>
      );
    }

    if (isImageUrl(mediaUrl)) {
      return (
        <div className="mb-4 overflow-hidden rounded-3xl bg-slate-100">
          <img
            src={mediaUrl}
            alt={title}
            className="w-full h-56 object-cover rounded-3xl"
          />
        </div>
      );
    }

    return null;
  };

  const displayDate = isNaN(Date.parse(date)) ? date : new Date(date).toLocaleDateString();

  return (
    <div className="card group hover:shadow-lg transition-all duration-200 h-full flex flex-col">
      {renderMediaPreview()}
      <div className="flex items-start space-x-4">
        <div className="shrink-0">
          {getFileIcon(fileType)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                {title}
              </h3>
              {description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
            <div className="flex items-center flex-wrap gap-2">
              <span>{displayDate}</span>
              {category && (
                <>
                  <span>•</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {category}
                  </span>
                </>
              )}
            </div>
            {fileSize && (
              <span className="text-gray-400">
                {fileSize}
              </span>
            )}
          </div>

          {onView && (
            <div className="mt-4">
              <button
                onClick={onView}
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 text-white text-sm font-medium px-4 py-2 hover:bg-indigo-700 transition-colors"
              >
                View
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
