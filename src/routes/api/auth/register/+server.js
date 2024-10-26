import { json } from '@sveltejs/kit';
import { BACKEND_URL } from '$env/static/private';

const register_endpoint = `${BACKEND_URL}/api/user/register`;

export const POST = async ({ request, cookies }) => {
    const { email, password, username } = await request.json();
    
    const response = await fetch(register_endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
    });

    if (!response.ok) {
        return json({ success: false, message: 'Failed to register user' }, { status: response.status });
    }

    const parsed_response = await response.json();

    const stringified_user = JSON.stringify({
        username : parsed_response.user.username,
        email: parsed_response.user.email,
        id: parsed_response.user.id,
        token: parsed_response.token
    }) 

    cookies.set('user_data', stringified_user, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24
    });

    return json({ success: true });
};
