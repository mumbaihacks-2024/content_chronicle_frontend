import { json } from '@sveltejs/kit';

export const POST = async ({ request, cookies }) => {
    cookies.delete('user_data', { path: '/' }); 
    return json({ success: true });
};
