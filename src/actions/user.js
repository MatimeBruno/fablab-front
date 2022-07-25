import fablab_api from './config/api_instance';

const login = async (email, password) => {
	try
	{
		const payload = {
			"email":email,
			"password":password
		};

		const response = await fablab_api.post('/login', payload);

		if (response.data !== false)
		{
			sessionStorage.setItem("u", response.data);
			return response.data;
		}

		return null;
	}
	catch (error)
	{
		return null;
	}
}

const userData = async (id) => {
	try
	{
		const response = await fablab_api.get(`/user/${id}`);
		return response.data;
	}
	catch (error)
	{
		console.error(error);
		return null;
	}
}

const updatePassword = async (id, oldpass, newpass) => {
	try
	{
		const payload = {
			"id_user" : id,
			"oldpass" : oldpass,
			"newpass" : newpass
		};

		const response = await fablab_api.post("/updatepass", payload);

		if (response.data)
		{
			return response.data;
		}

		return false;
	}
	catch (error)
	{
		return false;
	}
}

const logout = () => {
	sessionStorage.removeItem("u");
}

export {login, logout, userData, updatePassword};