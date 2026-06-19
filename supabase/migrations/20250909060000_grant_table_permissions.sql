-- Grant table-level permissions to roles
-- RLS policies exist but table access must also be explicitly granted

-- products
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;

-- product_images
GRANT SELECT ON public.product_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_images TO authenticated;

-- profiles
GRANT SELECT ON public.profiles TO authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;

-- conversations
GRANT SELECT, INSERT ON public.conversations TO authenticated;

-- participants
GRANT SELECT, INSERT ON public.participants TO authenticated;

-- messages
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;

-- message_status
GRANT SELECT, INSERT, UPDATE, DELETE ON public.message_status TO authenticated;

-- saved_products
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_products TO authenticated;
