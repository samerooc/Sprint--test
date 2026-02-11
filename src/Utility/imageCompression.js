import imageCompression from 'browser-image-compression'

export const compressImage = async (imageFile) => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.8
  }

  try {
    const originalSize = (imageFile.size / 1024 / 1024).toFixed(2)
    console.log(`📦 Original: ${originalSize} MB`)
    
    const compressed = await imageCompression(imageFile, options)
    
    const compressedSize = (compressed.size / 1024 / 1024).toFixed(2)
    const saved = ((1 - compressed.size / imageFile.size) * 100).toFixed(1)
    
    console.log(`✅ Compressed: ${compressedSize} MB (${saved}% saved)`)
    
    return compressed
  } catch (error) {
    console.error('❌ Compression failed:', error)
    return imageFile
  }
}

export const validateImage = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024

  if (!file) {
    throw new Error('No file selected')
  }

  if (!validTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG, WEBP allowed')
  }

  if (file.size > maxSize) {
    throw new Error('File too large (max 10MB)')
  }

  return true
}