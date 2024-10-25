export const handle = async ({ event, resolve }) => {

    const token = event.cookies.get('user_data');
    
    if (token) {
        const payload = JSON.parse(token);
        if (payload) {
            event.locals.user = payload;
        }
    }
    
    if (event.url.pathname.startsWith('/workspace') && !event.locals.user) {
        return new Response('Unauthorized', { status: 301, headers: { Location: '/login' } });
    }
    
    return resolve(event);
};