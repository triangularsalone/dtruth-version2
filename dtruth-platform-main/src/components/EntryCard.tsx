interface EntryCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
}

export default function EntryCard({
  title,
  description,
  icon,
  onClick,
  disabled = false,
  variant = 'default'
}: EntryCardProps) {
  const baseClasses = "card group transition-all duration-200 cursor-pointer";

  const variantClasses = {
    default: "hover:shadow-lg hover:border-gray-300",
    primary: "hover:shadow-lg hover:border-indigo-300 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200",
    secondary: "hover:shadow-lg hover:border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-4">
        {icon && (
          <div className={`shrink-0rounded-full ${
            variant === 'primary' ? 'bg-indigo-100' :
            variant === 'secondary' ? 'bg-green-100' :
            'bg-gray-100'
          }`}>
            <div className={`${
              variant === 'primary' ? 'text-indigo-600' :
              variant === 'secondary' ? 'text-green-600' :
              'text-gray-600'
            }`}>
              {icon}
            </div>
          </div>
        )}

        <div className="flex-1">
          <h3 className={`text-lg font-semibold transition-colors ${
            variant === 'primary' ? 'text-indigo-900 group-hover:text-indigo-700' :
            variant === 'secondary' ? 'text-green-900 group-hover:text-green-700' :
            'text-gray-900 group-hover:text-indigo-600'
          }`}>
            {title}
          </h3>
          <p className="text-gray-600 mt-1">
            {description}
          </p>
        </div>

        <div className="flex-shrink-0">
          <svg
            className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
              variant === 'primary' ? 'text-indigo-600' :
              variant === 'secondary' ? 'text-green-600' :
              'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
