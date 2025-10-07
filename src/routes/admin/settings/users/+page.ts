import type { PageLoad } from './$types';
import { getUsers } from '$lib/remote/admin/users.remote';

export const load: PageLoad = async () => {
	return {
		users: getUsers()
	};
};
