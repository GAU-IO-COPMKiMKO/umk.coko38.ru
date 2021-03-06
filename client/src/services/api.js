import axios from 'axios'
// eslint-disable-next-line
import store from '../store'

export default () => {
	return axios.create({
		// baseURL: 'http://localhost:3000/',
		headers: {
			Authorization: `Bearer ${store.state.token}`,
		},
	})
}
