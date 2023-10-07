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
      className={`flex items-center gap-2 text-white/90 hover:text-white transition-colors ${className}`}
      onClick={onClick}
    >
      <Icon
        size={iconSize || 22}
        className=""
      />
      <span className={`text-${textSize || 'sm'} font-bold`}>{text}</span>
    </button>
  )
}
