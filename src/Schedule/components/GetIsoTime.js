import moment from 'moment';
export const GetIsoTime = (time) => {
	return moment(time).format().substring(0,moment(time).format().length-6)
}