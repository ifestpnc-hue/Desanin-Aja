
-- Create storage bucket for chat attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-attachments', 'chat-attachments', true);

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload chat files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-attachments' AND auth.role() = 'authenticated');

-- Allow everyone to view chat files (public bucket)
CREATE POLICY "Anyone can view chat files"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-attachments');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own chat files"
ON storage.objects FOR DELETE
USING (bucket_id = 'chat-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add file_url and file_name columns to chat_messages
ALTER TABLE public.chat_messages ADD COLUMN file_url TEXT;
ALTER TABLE public.chat_messages ADD COLUMN file_name TEXT;
