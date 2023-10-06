import { IconType } from 'react-icons'

interface IconButtonProps {
  Icon: IconType
  text: string
  iconSize?: number
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  onClick?: () => {}
  className?: string
}

export default function IconButton({ Icon, text, iconSize, textSize, onClick, className }: IconButtonProps) {
  return (
    <button
      className={`group flex items-center gap-2 ${className}`}
      onClick={onClick}
    >
      <Icon
        size={iconSize || 22}
        className="text-white/90 group-hover:text-white transition-colors"
      />
      <span className={`text-${textSize || 'sm'} font-bold text-white/90 group-hover:text-white transition-colors`}>
        {text}
      </span>
    </button>
  )
}
