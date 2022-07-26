import fablab_api from './config/api_instance';

const getSpaces = async () => {
	try
	{
		const response = await fablab_api.get('/espaces');
		return response.data;
	}
	catch (error)
	{
		return false;
	}
}

const reserve = async (id_user, reservations, listIdEspace) => {
	try
	{
		const payload = {
			"id_user":id_user,
			"reservations":reservations,
			"listIdEspace":listIdEspace
		};

		const response = await fablab_api.post('/resa', payload);
		return response.data;
	}
	catch (error)
	{	
		return error.response.data;
	}
}

const getMyReserv = async (id_user, orderList) => {
	try
	{
		const response = await fablab_api.get(`/user_resa/${id_user}&${orderList}`);
		return response.data;
	}
	catch (error)
	{	
		return false;
	}
}

const getSpaceReserv = async (id_reserv) => {
	try
	{
		const response = await fablab_api.get(`/espace_resa/${id_reserv}`);
		return response.data;
	}
	catch (error)
	{	
		return false;
	}
}

export {reserve, getSpaces, getMyReserv, getSpaceReserv};