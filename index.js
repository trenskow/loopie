'use strict';

module.exports = exports = {};

// Group array.
exports.group = (items, tester) => {

	return new Promise((resolv, reject) => {

		let result = {};

		const next = (idx) => {

			if (idx == items.length) return resolv(result);

			Promise.resolve(tester(items[idx], idx))
				.then((ret) => {
					let groups = ret;
					if (!Array.isArray(groups)) groups = [groups];
					groups
						.filter(group => typeof group !== 'undefined')
						.forEach(group => {
							result[group] = result[group] || [];
							result[group].push(items[idx]);
						});
				})
				.then(() => {
					next(idx + 1);
				})
				.catch(reject);

		};

		next(0);

	});

};

// Map array
exports.map = (items, mapper) => {

	return new Promise((resolv, reject) => {

		let result = [];

		const next = (idx) => {
			if (idx === items.length) return resolv(result);
			Promise.resolve(mapper(items[idx], idx))
				.then((mapped) => {
					result.push(mapped);
				})
				.then(() => {
					next(idx + 1);
				})
				.catch(reject);
		};

		next(0);

	});

};

// Map object.
exports.map.obj = (obj, mapper) => {

	return new Promise((resolv, reject) => {

		const keys = Object.keys(obj);

		let result = {};

		const next = (idx) => {

			if (idx == keys.length) return resolv(result);

			const key = keys[idx];

			Promise.resolve(mapper(obj[key], key))
				.then((mapped) => {
					result[key] = mapped;
				})
				.then(() => {
					next(idx + 1);
				})
				.catch(reject);

		};

		next(0);

	});

};

// For each in array.
exports.each = (items, todo) => {

	return new Promise((resolv, reject) => {

		const next = (idx) => {
			if (idx === items.length) return resolv();
			Promise.resolve(todo(items[idx], idx))
				.then((stop) => {
					if (stop) return resolv();
					next(idx + 1);
				})
				.catch(reject);
		};

		next(0);

	});

};

// For each key in object.
exports.each.obj = (obj, todo) => {

	const keys = Object.keys(obj);

	return exports.each(keys, (key) => {
		return todo(obj[key], key);
	});

};

// Reduce array
exports.reduce = (memo, items, transform) => {

	return new Promise((resolv, reject) => {

		let result = memo;

		const next = (idx) => {
			if (idx === items.length) return resolv(result);
			Promise.resolve(transform(result, items[idx], idx))
				.then((memo) => {
					result = memo;
				})
				.then(() => {
					next(idx + 1);
				})
				.catch(reject);
		};

		next(0);

	});

};

// Reduce object
exports.reduce.obj = (memo, obj, transform) => {

	const keys = Object.keys(obj);

	return exports.reduce(memo, keys, (memo, key) => {
		return transform(memo, obj[key], key);
	});

};

// Filter array
exports.filter = (items, tester) => {

	return new Promise((resolv, reject) => {

		let result = [];

		const next = (idx) => {
			if (idx === items.length) return resolv(result);
			Promise.resolve(tester(items[idx], idx))
				.then((include) => {
					if (include) result.push(items[idx]);
				})
				.then(() => {
					next(idx + 1);
				})
				.catch(reject);
		};

		next(0);

	});

};
