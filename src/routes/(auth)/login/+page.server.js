import { fetchAPI } from "$lib/api";
import { redirect, fail } from "@sveltejs/kit";

export const load = async ({cookies}) => {
    // restrict the login page if the is login
    const token = cookies.get('access_token')

    if(token) {
        throw redirect(302, '/dashboard')
    }

}


export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		// if (!email || !password) {
		// 	return fail(400, { error: "Fields can't be empty" });
		// }

		try {
			const response = await fetchAPI('user/login/', 'POST', { email, password });

			// Handle API error format
			if (response?.email) {
				return fail(400, { error: response.email });
			}

			// Save token in cookies (server-friendly)
			if (response?.access) {
				cookies.set('access_token', response.access, {
					path: '/',
					httpOnly: false,
					sameSite: 'lax',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24 // 1 day
				});

                 throw redirect(302, '/dashboard');
			}

			// Redirect to dashboard after login
            
		} catch (err) {
            console.error(err);
			return fail(500, { error: 'Server error, please try again later' });
		}
        
       
	}
};
