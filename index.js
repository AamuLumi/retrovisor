(() => {
	let seenValues = null;
	let initialWindowVariable = null;

	function deepFindValueInArray(a, searchValue, currentObjectPath = '') {
		if (!Array.isArray(a)) {
			throw new Error(`deepFindValueInArray error: ${currentObjectPath} is not an array.`);
		}

		let results = [];

		for (let i = 0; i < a.length; i++) {
			if (a[i] === searchValue) {
				results.push(`${currentObjectPath}[${i}]`);
			} else if (Array.isArray(a[i]) && !seenValues.has(a[i])) {
				seenValues.add(a[i]);
				results = [
					...results,
					...deepFindValueInArray(a[i], searchValue, `${currentObjectPath}[${i}]`),
				];
			} else if (!!a[i] && typeof a[i] === 'object' && !seenValues.has(a[i])) {
				seenValues.add(a[i]);

				results = [
					...results,
					...deepFindValueInObject(a[i], searchValue, `${currentObjectPath}[${i}]`),
				];
			}
		}

		return results;
	}

	function deepFindValueInObject(o, searchValue, currentObjectPath = '') {
		const keys = Object.keys(o);
		let results = [];

		for (let i = 0; i < keys.length; i++) {
			const value = o[keys[i]];

			if (value === searchValue) {
				results.push(`${currentObjectPath}.${keys[i]}`);
			} else if (Array.isArray(value) && !seenValues.has(value)) {
				seenValues.add(value);
				results = [
					...results,
					...deepFindValueInArray(value, searchValue, `${currentObjectPath}.${keys[i]}`),
				];
			} else if (!!value && typeof value === 'object' && !seenValues.has(value)) {
				seenValues.add(value);

				results = [
					...results,
					...deepFindValueInObject(value, searchValue, `${currentObjectPath}.${keys[i]}`),
				];
			}
		}

		return results;
	}

	function deepFindRegexValueInArray(a, regex, currentObjectPath = '') {
		if (!Array.isArray(a)) {
			throw new Error(
				`deepFindRegexValueInArray error: ${currentObjectPath} is not an array.`,
			);
		}

		let results = [];

		for (let i = 0; i < a.length; i++) {
			if (!!a[i] && a[i].toString && regex.test(a[i].toString())) {
				results.push(`${currentObjectPath}[${i}] - ${a[i].toString()}`);
			} else if (Array.isArray(a[i]) && !seenValues.has(a[i])) {
				seenValues.add(a[i]);
				results = [
					...results,
					...deepFindValueInArray(a[i], regex, `${currentObjectPath}[${i}]`),
				];
			} else if (!!a[i] && typeof a[i] === 'object' && !seenValues.has(a[i])) {
				seenValues.add(a[i]);

				results = [
					...results,
					...deepFindValueInObject(a[i], regex, `${currentObjectPath}[${i}]`),
				];
			}
		}

		return results;
	}

	function deepFindRegexValueInObject(o, regex, currentObjectPath = '') {
		const keys = Object.keys(o);
		let results = [];

		for (let i = 0; i < keys.length; i++) {
			const value = o[keys[i]];

			if (!!value && value.toString && regex.test(value.toString())) {
				results.push(`${currentObjectPath}.${keys[i]} - ${value.toString()}`);
			} else if (Array.isArray(value) && !seenValues.has(value)) {
				seenValues.add(value);
				results = [
					...results,
					...deepFindRegexValueInArray(value, regex, `${currentObjectPath}.${keys[i]}`),
				];
			} else if (!!value && typeof value === 'object' && !seenValues.has(value)) {
				seenValues.add(value);

				results = [
					...results,
					...deepFindRegexValueInObject(value, regex, `${currentObjectPath}.${keys[i]}`),
				];
			}
		}

		return results;
	}

	function deepGetKeysInArray(a) {
		if (!Array.isArray(a)) {
			throw new Error(`deepGetKeysInArray error: ${a} is not an array.`);
		}

		const result = [];

		for (let i = 0; i < a.length; i++) {
			if (Array.isArray(a[i]) && !seenValues.has(a[i])) {
				seenValues.add(a[i]);
				result[i] = deepGetKeysInArray(a[i]);
			} else if (!!a[i] && typeof a[i] === 'object' && !seenValues.has(a[i])) {
				seenValues.add(a[i]);

				result[i] = deepGetKeysInObject(a[i]);
			} else {
				result[i] = !!a[i];
			}
		}

		return result;
	}

	function deepGetKeysInObject(o) {
		const keys = Object.keys(o);
		let result = {};

		for (let i = 0; i < keys.length; i++) {
			try {
				const value = o[keys[i]];

				if (Array.isArray(value) && !seenValues.has(value)) {
					seenValues.add(value);
					result[keys[i]] = deepGetKeysInArray(value);
				} else if (!!value && typeof value === 'object' && !seenValues.has(value)) {
					seenValues.add(value);

					result[keys[i]] = deepGetKeysInObject(value);
				} else {
					result[keys[i]] = !!value;
				}
			} catch (e) {
				if (e instanceof DOMException) {
					continue;
				}

				throw e;
			}
		}

		return result;
	}

	function deepSubtractOfArrays(a1, a2) {
		if (!Array.isArray(a1) || !Array.isArray(a2)) {
			throw new Error(`deepSubtractOfArrays error: a1:${a1} or a2:${a2} is not an array.`);
		}

		const result = [];

		for (let i = 0; i < a1.length; i++) {
			if (Array.isArray(a1[i]) && !seenValues.has(a1[i])) {
				seenValues.add(a1[i]);

				if (!Array.isArray(a2[i])) {
					result[i] = a1[i];
				} else {
					result[i] = deepSubtractOfArrays(a1[i], a2[i]);
				}
			} else if (!!a1[i] && typeof a1[i] === 'object' && !seenValues.has(a1[i])) {
				seenValues.add(a1[i]);

				if (typeof a2[i] !== 'object') {
					result[i] = a1[i];
				} else {
					result[i] = deepSubtractOfObjects(a1[i], a2[i]);
				}
			} else if (!!a1[i] !== !!a2[i]) {
				result[i] = a1[i];
			}
		}

		return result;
	}

	function deepSubtractOfObjects(o1, o2) {
		const keys = Object.keys(o1);
		let result = {};

		for (let i = 0; i < keys.length; i++) {
			const value = o1[keys[i]];

			if (Array.isArray(value) && !seenValues.has(value)) {
				seenValues.add(value);

				if (!Array.isArray(o2[keys[i]])) {
					result[keys[i]] = o1[keys[i]];
				} else {
					result[keys[i]] = deepSubtractOfArrays(value, o2[keys[i]]);
				}
			} else if (!!value && typeof value === 'object' && !seenValues.has(value)) {
				seenValues.add(value);

				if (typeof o2[keys[i]] !== 'object') {
					result[keys[i]] = o1[keys[i]];
				} else {
					result[keys[i]] = deepSubtractOfObjects(value, o2[keys[i]]);
				}
			} else if (!!value !== !!o2[keys[i]]) {
				result[keys[i]] = value;
			}
		}

		return result;
	}

	function init() {
		seenValues = new WeakSet();
	}

	window.Retrovisor = {
		findValueInWindow: (str) => {
			init();

			return deepFindValueInObject(window, str);
		},

		findRegexValueInWindow: (regex) => {
			if (typeof regex !== 'object' || !regex.test) {
				throw new Error('findRegexValueInWindow need a regex');
			}
			init();

			return deepFindRegexValueInObject(window, regex);
		},

		dumpCurrentWindowVariables: () => {
			init();

			return `Retrovisor.loadInitialWindowVariable(${JSON.stringify(
				deepGetKeysInObject(window),
			)})`;
		},

		loadInitialWindowVariable: (o) => {
			initialWindowVariable = o;
		},

		extractNonNativeVariablesFromWindow: () => {
			if (!initialWindowVariable) {
				throw new Error(
					`You first need to create a dump of window variable in your browser new tab with Retrovisor.dumpCurrentWindowVariables, and execute the returned text in this current tab.`,
				);
			}

			init();

			return deepSubtractOfObjects(window, initialWindowVariable.window);
		},
	};
})();
