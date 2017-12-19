export const Loop=(data=[])=>{
	let options = [];
	data.map((item) => {
		let option = {
			value: item.name+'--'+item.pk+'--'+item.code,
			label: item.name,
			children: (item.children && item.children.length) ? Loop(item.children) : []
		};
		options.push(option);
	});
	return options;
};