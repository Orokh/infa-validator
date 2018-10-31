const config = require('../config');
const common = require('./common');

class MappItemValidator {
	constructor(type, params) {
		this.type = type;
		this.params = params;
	}

	validate(mappItem) {
		const result = {
			name: mappItem.$.NAME,
			errors: [],
			transformations: []
		};
		const fromLinks = [];
		const toLinks = [];

		result.errors.push(common.checkName(mappItem.$.NAME, this.type, this.params));
		result.errors.push(common.checkDescription(mappItem.$.DESCRIPTION, this.params));

		mappItem.CONNECTOR.forEach(e => {
			fromLinks.push(`${e.$.FROMINSTANCE}|${e.$.FROMFIELD}`);
			toLinks.push(`${e.$.TOINSTANCE}|${e.$.TOFIELD}`);
		});

		if (mappItem.TRANSFORMATION) {
			result.transformations = mappItem.TRANSFORMATION.map(e =>
				this.checkTransformation(e, fromLinks, toLinks)
			);

			if (mappItem.CONNECTOR) {
				result.errors.push(
					...mappItem.CONNECTOR.map(e =>
						MappItemValidator.checkConnector(e, mappItem.TRANSFORMATION)
					)
				);
			}
		}

		result.errors = result.errors.filter(e => Object.keys(e).length !== 0);

		return result;
	}

	checkTransformation(trans, fromLinks, toLinks) {
		const result = {
			name: trans.$.NAME,
			errors: []
		};
		let transType = trans.$.TYPE;

		// Take custom types in account
		if (transType === config.OBJECT_TYPE.CUSTOM) {
			transType = trans.$.TEMPLATENAME;
		}

		result.errors.push(common.checkName(trans.$.NAME, transType, this.params));
		result.errors.push(common.checkDescription(trans.$.DESCRIPTION, this.params));

		if (trans.TRANSFORMFIELD) {
			result.errors.push(...trans.TRANSFORMFIELD.map(e => this.checkFieldName(e, transType)));
			result.errors.push(
				...trans.TRANSFORMFIELD.map(e =>
					MappItemValidator.checkFieldConnection(
						e,
						trans.$.NAME,
						transType,
						fromLinks,
						toLinks
					)
				)
			);
		}

		if (trans.TABLEATTRIBUTE) {
			result.errors.push(
				...trans.TABLEATTRIBUTE.map(e => this.checkAttribute(e, trans.$.NAME, transType))
			);
		}

		result.errors = result.errors.filter(e => Object.keys(e).length !== 0);

		return result;
	}

	checkFieldName(field, transType) {
		let badName = false;
		let errText = '';
		let result = {};

		// Check Field Name against standard
		if (field.$.NAME.startsWith('NEWFIELD')) {
			badName = true;
			errText = `Rename field ${field.$.NAME}`;
		} else if (config.EXCLUDE_TRANS_NAME.indexOf(transType) === -1) {
			// Check input - output - variable fields
			if (['INPUT', 'OUTPUT', 'LOCAL VARIABLE'].indexOf(field.$.PORTTYPE) > -1) {
				if (!field.$.NAME.startsWith(this.params.NAMING[`FIELD_${field.$.PORTTYPE}`])) {
					badName = true;
					errText = `Rename field ${field.$.NAME} (${field.$.PORTTYPE} field)`;
				}
			} else if (field.$.PORTTYPE === 'INPUT/OUTPUT') {
				if (
					field.$.NAME.startsWith(this.params.NAMING.FIELD_INPUT) ||
					field.$.NAME.startsWith(this.params.NAMING.FIELD_OUTPUT) ||
					field.$.NAME.startsWith(this.params.NAMING.FIELD_LOCAL_VARIABLE)
				) {
					badName = true;
					errText = `Rename field ${field.$.NAME} (${field.$.PORTTYPE} field)`;
				}
			}
		}

		if (badName) {
			result = {
				severity: config.SEVERITY.ERROR,
				text: errText
			};
		}
		return result;
	}

	static checkFieldConnection(field, transName, transType, fromLinks, toLinks) {
		const linkName = `${transName}|${field.$.NAME}`;
		let result = {};

		if (config.EXCLUDE_TRANS_CONNEC.indexOf(transType) === -1) {
			if (field.$.PORTTYPE === 'INPUT/OUTPUT' || field.$.PORTTYPE === 'INPUT') {
				if (toLinks.indexOf(linkName) === -1) {
					result = {
						severity: config.SEVERITY.ERROR,
						text: `Input ${field.$.NAME} not connected`
					};
				}
			}
			if (field.$.PORTTYPE === 'INPUT/OUTPUT' || field.$.PORTTYPE === 'OUTPUT') {
				if (fromLinks.indexOf(linkName) === -1) {
					result = {
						severity: config.SEVERITY.ERROR,
						text: `Output ${field.$.NAME} not connected`
					};
				}
			}
		}

		return result;
	}

	checkAttribute(attr, transName, transType) {
		let result = {};

		switch (transType) {
			case config.OBJECT_TYPE.LOOKUP:
				if (attr.$.NAME === 'Lookup policy on multiple match') {
					if (this.params.warning_enabled === true && attr.$.VALUE !== 'Report Error') {
						result = {
							severity: config.SEVERITY.WARNING,
							text: 'No alert on multiple results'
						};
					}
				} else if (attr.$.NAME === 'Lookup Sql Override') {
					if (
						(attr.$.VALUE.length > 0 &&
							!transName.startsWith(
								this.params.NAMING[config.OBJECT_TYPE.LOOKUPOW]
							)) ||
						(attr.$.VALUE.length === 0 &&
							transName.startsWith(this.params.NAMING[config.OBJECT_TYPE.LOOKUPOW]))
					) {
						result = {
							severity: config.SEVERITY.ERROR,
							text: `Invalid Name - ${
								attr.$.VALUE.length === 0 ? ' Not ' : ' '
							} Overriden`
						};
					}
				}
				break;
			case config.OBJECT_TYPE.SQ:
				if (attr.$.NAME === 'Sql Query') {
					if (
						(attr.$.VALUE.length > 0 &&
							!transName.startsWith(this.params.NAMING[config.OBJECT_TYPE.SQOW])) ||
						(attr.$.VALUE.length === 0 &&
							transName.startsWith(this.params.NAMING[config.OBJECT_TYPE.SQOW]))
					) {
						result = {
							severity: config.SEVERITY.ERROR,
							text: `Invalid Name - ${
								attr.$.VALUE.length === 0 ? ' Not ' : ' '
							} Overriden`
						};
					}
				}
				break;
			default:
				break;
		}

		return result;
	}

	static checkConnector(connector, transList) {
		const fromTrans = transList.find(e => e.$.NAME === connector.$.FROMINSTANCE);
		const toTrans = transList.find(e => e.$.NAME === connector.$.TOINSTANCE);
		let badConnector = false;
		let errText = '';
		let result = {};

		if (fromTrans && toTrans) {
			const fromField = fromTrans.TRANSFORMFIELD.find(
				e => e.$.NAME === connector.$.FROMFIELD
			);
			const toField = toTrans.TRANSFORMFIELD.find(e => e.$.NAME === connector.$.TOFIELD);

			if (fromField && toField) {
				const fromName = `${fromTrans.$.NAME}.${fromField.$.NAME}`;
				const toName = `${toTrans.$.NAME}.${toField.$.NAME}`;

				// Check precision and datatype of both linked fields
				if (fromField.DATATYPE !== toField.DATATYPE) {
					badConnector = true;
					errText = `Data types do not match (${fromName} > ${toName})`;
				} else if (fromField.PRECISION > toField.PRECISION) {
					badConnector = true;
					errText = `Data precisions do not match (${fromName} > ${toName})`;
				} else if (fromField.SCALE > toField.SCALE) {
					badConnector = true;
					errText = `Data scales do not match (${fromName} > ${toName})`;
				}
			}
		}
		if (badConnector) {
			result = {
				severity: config.SEVERITY.ERROR,
				text: errText
			};
		}

		return result;
	}
}

module.exports = MappItemValidator;
