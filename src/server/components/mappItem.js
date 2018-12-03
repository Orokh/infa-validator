const config = require('../config');
const common = require('./common');

class MappItemValidator {
	constructor(type, params) {
		this.type = type.name;
		this.params = params;
	}

	static getTransConfig(transType) {
		const result = Object.entries(config.TRANSFORMATIONS).filter(
			elt => elt[1].name === transType
		);

		return result[0][1];
	}

	validate(mappItem) {
		const name = mappItem.$.NAME;
		const description = mappItem.$.DESCRIPTION;

		const fromLinks = [];
		const toLinks = [];

		let result = {
			name,
			errors: [],
			transformations: []
		};

		result.errors.push(common.checkObjectName(name, this.type, this.params));
		result.errors.push(common.checkDescription(description, this.params));

		if (mappItem.CONNECTOR) {
			// Initiate list of links
			mappItem.CONNECTOR.forEach(elt => {
				fromLinks.push(`${elt.$.FROMINSTANCE}|${elt.$.FROMFIELD}`);
				toLinks.push(`${elt.$.TOINSTANCE}|${elt.$.TOFIELD}`);
			});

			result.errors.push(
				...mappItem.CONNECTOR.map(elt =>
					MappItemValidator.checkConnector(elt, mappItem.TRANSFORMATION)
				)
			);
		}

		result = common.cleanResult(result, this.params);

		// Transformations
		if (mappItem.TRANSFORMATION) {
			const transformations = this.cleanTransformations(mappItem.TRANSFORMATION);

			result.transformations = transformations.map(e =>
				this.checkTransformation(e, fromLinks, toLinks)
			);

			result.countErrors += result.transformations.reduce(
				(agg, elt) => agg + elt.countErrors,
				0
			);
			result.countWarn += result.transformations.reduce((agg, elt) => agg + elt.countWarn, 0);
		}

		return result;
	}

	cleanTransList(transformations) {
		let cleanTransformations = [];

		// Remove the 'Mapplet' transformation from Mapplets objects
		if (this.type === config.TRANSFORMATIONS.MAPPLET.name) {
			cleanTransformations = transformations.filter(
				elt => elt.$.TYPE !== config.TRANSFORMATIONS.MAPPLET.name
			);
		} else {
			cleanTransformations = transformations.slice();
		}

		return cleanTransformations;
	}

	static getTransType(transType, templateName) {
		// Take custom types in account
		if (transType === config.TRANSFORMATIONS.CUSTOM.name) {
			return templateName;
		}

		return transType;
	}

	checkTransformation(trans, fromLinks, toLinks) {
		const name = trans.$.NAME;
		const description = trans.$.DESCRIPTION;

		const result = {
			name,
			errors: []
		};

		const type = MappItemValidator.getTransType(trans.$.TYPE, trans.$.TEMPLATENAME);

		const typeConfig = MappItemValidator.getTransConfig(type);

		result.errors.push(common.checkTransName(name, type, this.params));
		result.errors.push(common.checkDescription(description, this.params));

		if (trans.TRANSFORMFIELD) {
			result.errors.push(
				...trans.TRANSFORMFIELD.map(e => this.checkFieldName(e, typeConfig))
			);

			result.errors.push(
				...trans.TRANSFORMFIELD.map(e =>
					MappItemValidator.checkFieldConnection(e, name, typeConfig, fromLinks, toLinks)
				)
			);
		}

		if (trans.TABLEATTRIBUTE) {
			result.errors.push(
				...trans.TABLEATTRIBUTE.map(e => this.checkAttribute(e, name, type))
			);
		}

		return common.cleanResult(result, this.params);
	}

	checkFieldName(field, transConfig) {
		let result = {};

		const name = field.$.NAME;
		const type = field.$.PORTTYPE;

		// Check Field Name against standard
		let isBadName = name.startsWith('NEWFIELD');
		let errText = `Rename field ${name}`;

		if (!isBadName && transConfig.checkFieldName) {
			errText = `Rename field ${name} (${type} field)`;

			if (['INPUT', 'OUTPUT', 'LOCAL VARIABLE'].indexOf(type) > -1) {
				// Check input - output - variable fields
				isBadName = !name.startsWith(this.params.NAMING.FIELDS[`${type}`].default);
			} else if (type === 'INPUT/OUTPUT') {
				// Check I/O fields
				isBadName =
					Object.entries(this.params.NAMING.FIELDS).filter(elt =>
						name.startsWith(elt[1].default)
					).length > 0;
			}
		}

		if (isBadName) {
			result = {
				severity: config.SEVERITY.ERROR,
				text: errText
			};
		}

		return result;
	}

	static checkFieldConnection(field, transName, transConfig, fromLinks, toLinks) {
		let result = {};
		let badConnection = false;
		let errText = '';

		if (transConfig.checkConnectors) {
			const name = field.$.NAME;
			const portType = field.$.PORTTYPE;
			const linkName = `${transName}|${name}`;

			if (portType === config.FIELDS.IO || portType === config.FIELDS.INPUT) {
				badConnection = toLinks.indexOf(linkName) === -1;
				errText = `Input ${name} not connected`;
			}

			if (portType === config.FIELDS.IO || portType === config.FIELDS.OUTPUT) {
				badConnection = fromLinks.indexOf(linkName) === -1;
				errText = `Output ${name} not connected`;
			}
		}

		if (badConnection) {
			result = {
				severity: config.SEVERITY.ERROR,
				text: errText
			};
		}

		return result;
	}

	checkAttribute(attr, transName, transType) {
		let result = {};

		const name = attr.$.NAME;
		const value = attr.$.VALUE;

		switch (transType) {
			case config.TRANSFORMATIONS.LOOKUP.name:
				if (name === 'Lookup policy on multiple match' && value !== 'Report Error') {
					result = {
						severity: config.SEVERITY.WARNING,
						text: 'No alert on multiple results'
					};
				} else if (name === 'Lookup Sql Override') {
					result = this.checkOverride(transType, transName, value);
				}
				break;
			case config.TRANSFORMATIONS.SOURCE.name:
				if (name === 'Sql Query') {
					result = this.checkOverride(transType, transName, value);
				}
				break;
			default:
				break;
		}

		return result;
	}

	checkOverride(transType, transName, sqlQuery) {
		let result = {};

		const overrideName = this.params.NAMING.TRANSFORMATIONS[transType.toUpperCase()].override;

		if (
			(sqlQuery.length > 0 && !transName.startsWith(overrideName)) ||
			(sqlQuery.length === 0 && transName.startsWith(overrideName))
		) {
			result = {
				severity: config.SEVERITY.ERROR,
				text: `Invalid Name - ${sqlQuery.length === 0 ? ' Not ' : ' '} Overriden`
			};
		}

		return result;
	}

	static checkConnector(connector, transList) {
		const fromTrans = transList.find(e => e.$.NAME === connector.$.FROMINSTANCE);
		const toTrans = transList.find(e => e.$.NAME === connector.$.TOINSTANCE);

		let badConnector = false;
		let result = {};

		if (fromTrans && toTrans) {
			const fromField = fromTrans.TRANSFORMFIELD.find(
				e => e.$.NAME === connector.$.FROMFIELD
			);
			const toField = toTrans.TRANSFORMFIELD.find(e => e.$.NAME === connector.$.TOFIELD);

			if (fromField && toField) {
				// Check precision and datatype of both linked fields
				badConnector =
					fromField.DATATYPE !== toField.DATATYPE ||
					fromField.PRECISION > toField.PRECISION ||
					fromField.SCALE > toField.SCALE;

				if (badConnector) {
					const fromName = `${fromTrans.$.NAME}.${fromField.$.NAME}`;
					const toName = `${toTrans.$.NAME}.${toField.$.NAME}`;

					const fromType = `${toField.DATATYPE} (${toField.PRECISION}, ${toField.SCALE})`;
					const toType = `${toField.DATATYPE} (${toField.PRECISION}, ${toField.SCALE})`;

					result = {
						severity: config.SEVERITY.ERROR,
						text: `Data types do not match (${fromName} - ${fromType} > ${toName} - ${toType})`
					};
				}
			}
		}

		return result;
	}
}

module.exports = MappItemValidator;
