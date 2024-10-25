import {redirect} from "@sveltejs/kit";

export const load = async ({ cookies }) => {
    throw redirect(302, '/workspace');
};