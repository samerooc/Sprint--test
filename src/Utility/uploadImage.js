import { cloudinaryConfig } from '../config/Cloudinary'
import { compressImage, validateImage } from './imageCompression'

export const uploadImage = async (file, folder = 'general') => {
  try {
    validateImage(file)
    console.log('✅ Validation passed')
    
    console.log('🔄 Compressing...')
    const compressedFile = await compressImage(file)
    
    const formData = new FormData()
    formData.append('file', compressedFile)
    formData.append('upload_preset', cloudinaryConfig.uploadPreset)
    formData.append('folder', `test-platform/${folder}`)
    
    console.log('☁️ Uploading to Cloudinary...')
    const response = await fetch(cloudinaryConfig.apiUrl, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Upload failed: ' + response.statusText)
    }
    
    const data = await response.json()
    
    console.log('✅ Upload successful!')
    console.log('📷 URL:', data.secure_url)
    
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}