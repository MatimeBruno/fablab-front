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

const checkHours = async (reservations, listIdEspace) => {
	try
	{
		const payload = {
			"dates":reservations,
			"listIdEspace":listIdEspace
		};

		const response = await fablab_api.post('/resa/date', payload);
		const hours_data = {
			morning_hours:[],
			afternoon_hours:[]
		}
		let cpt = 0;
		while (cpt < response.data.length)
		{
			let hour = response.data[cpt];
			let hour_str = "";
			if (cpt > 0 && hour === response.data[cpt-1]+1 && hour !== 13)
			{
				hour_str += response.data[cpt-1]
				hour_str += `_${hour}`
			}
			else
			{
				hour_str += hour
				hour_str += `_${response.data[cpt+1]}`
			}

			if (hour < 13)
			{
				if(!hours_data.morning_hours.includes(hour_str))
				{
					hours_data.morning_hours.push(hour_str);
				}
			}
			else
			{
				if(!hours_data.afternoon_hours.includes(hour_str))
				{
					hours_data.afternoon_hours.push(hour_str);
				}
			}
			++cpt;
		}

		return hours_data;
	}
	catch (error)
	{
		// console.log(error.response.data);
		return false
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

export {reserve, checkHours, getSpaces, getMyReserv, getSpaceReserv};