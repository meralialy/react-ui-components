import type { HTMLAttributes } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { colorNames } from '../../theme/theme'
import type { ColorName } from '../../theme/theme'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** Person's name: used for the image's alt text and the initials fallback. */
  name: string
  /** Photo URL. If missing or it fails to load, initials are shown instead. */
  src?: string
  size?: AvatarSize
  /** Set when the name is already shown next to the avatar, so screen readers don't hear it twice. */
  decorative?: boolean
}

const sizes: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 }

const Root = styled.span<{ $size: AvatarSize; $color: ColorName }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => sizes[$size]}px;
  height: ${({ $size }) => sizes[$size]}px;
  overflow: hidden;
  border: 1px solid ${({ theme, $color }) => theme.colors[$color].text};
  border-radius: 50%;
  background-color: ${({ theme, $color }) => theme.colors[$color].subtle};
  color: ${({ theme, $color }) => theme.colors[$color].text};
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: ${({ $size }) => Math.round(sizes[$size] * 0.4)}px;
  font-weight: 600;
  line-height: 1;
  vertical-align: middle;
  user-select: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const initials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const letters =
    words.length > 1 ? words[0][0] + words[words.length - 1][0] : (words[0] ?? '?').slice(0, 2)
  return letters.toUpperCase()
}

// The same name always gets the same color, so people are recognizable across the app.
const colorFor = (name: string): ColorName => {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return colorNames[hash % colorNames.length]
}

/** A person's photo, or their initials on a consistent color when there's no photo. */
export function Avatar({ name, src, size = 'md', decorative = false, ...rest }: AvatarProps) {
  // Remember which src failed, so a new src gets a fresh attempt
  const [failedSrc, setFailedSrc] = useState<string>()
  const showImage = Boolean(src) && failedSrc !== src

  return (
    <Root
      $size={size}
      $color={colorFor(name)}
      role={showImage || decorative ? undefined : 'img'}
      aria-label={showImage || decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      {...rest}
    >
      {showImage ? (
        <img src={src} alt={decorative ? '' : name} onError={() => setFailedSrc(src)} />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </Root>
  )
}
