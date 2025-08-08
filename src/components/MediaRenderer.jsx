import { Image } from 'react-native'
import MediaVideo from './MediaVideo'

const MediaRenderer = ({ mediaType, uri, className = '', style = {} }) => {
  if (mediaType === 'video') {
    return <MediaVideo uri={uri} className={className} style={style} />
  }

  return (
    <Image
      source={{ uri }}
      className={className}
      style={style}
      resizeMode="cover"
    />
  )
}

export default MediaRenderer
