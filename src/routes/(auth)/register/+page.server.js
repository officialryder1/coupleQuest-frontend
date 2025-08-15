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
    default: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const username = formData.get('username')
        const password = formData.get('password');

        // if (!email || !password) {
        // 	return fail(400, { error: "Fields can't be empty" });
        // }

        try {
            const response = await fetchAPI('user/register/', 'POST', { email, username, password });
            console.log(response)

            // Handle API error format
            if (response?.email) {
                return fail(400, { error: response.email });
            }


            if(response?.success) {
                // Redirect to dashboard after login
                 throw redirect(302, '/login');
            }
          

        } catch (err) {
            console.error(err);
            return fail(500, { error: 'Server error, please try again later' });
        }
        
        
    }
};
