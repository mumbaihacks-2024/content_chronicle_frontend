import {redirect} from "@sveltejs/kit";

export const load = async ({ cookies, locals }) => {
    const accessToken = cookies.get('user_data');
    if (!accessToken) {
        throw redirect(302, '/login');
    }
    const user = JSON.parse(accessToken);
    return {
        user : user
    }
};