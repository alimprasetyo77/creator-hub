import fs from 'fs';
import { ResponseError } from './response-error';
import { supabase } from './supabase-client';
import { ProductCreateType } from '../validations/product-validation';
/**
 * Uploads an image to Supabase and returns the public URL
 * @param newImage - The new image to upload
 * @param oldImage - The old image to remove
 * @returns The public URL of the uploaded image
 */
const uploadImage = async (newImage: ProductCreateType['thumbnail'], oldImage?: string): Promise<string> => {
  if (!newImage) throw new ResponseError(400, 'New image is required');
  if (oldImage) {
    const avatarPath = oldImage?.split('/').pop();
    const { data: removeResult, error: removeError } = await supabase.storage
      .from('avatar')
      .remove([avatarPath!]);
    if (removeError) {
      throw new ResponseError(400, removeError.message);
    }
  }
  const fileBuffer = fs.readFileSync(newImage.filepath);
  const { data: uploadResult, error: uploadError } = await supabase.storage
    .from('avatar')
    .upload(newImage.newFilename, fileBuffer, {
      contentType: newImage?.mimetype,
      upsert: false,
    });

  if (uploadError) {
    throw new ResponseError(400, uploadError.message);
  }

  const { data: result } = supabase.storage.from('avatar').getPublicUrl(uploadResult.path);

  return result.publicUrl;
};
export default uploadImage;
