/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type LexiconDoc, Lexicons, ValidationError, type ValidationResult } from "@atproto/lexicon";
import { is$typed, maybe$typed } from "./util.js";

export const schemaDict = {
	WinTomoXPushatAddDevice: {
		lexicon: 1,
		id: "win.tomo-x.pushat.addDevice",
		defs: {
			main: {
				type: "procedure",
				input: {
					encoding: "application/json",
					schema: {
						type: "object",
						required: ["token", "name"],
						properties: {
							token: {
								type: "string",
							},
							name: {
								type: "string",
								maxGraphemes: 30,
								maxLength: 300,
							},
						},
					},
				},
				output: {
					encoding: "application/json",
					schema: {
						type: "object",
						required: ["id"],
						properties: {
							id: {
								type: "string",
								format: "tid",
							},
						},
					},
				},
				errors: [
					{
						name: "AlreadyRegisteredError",
					},
				],
			},
		},
	},
	WinTomoXPushatDefs: {
		lexicon: 1,
		id: "win.tomo-x.pushat.defs",
		defs: {
			deviceList: {
				type: "array",
				items: {
					type: "ref",
					ref: "lex:win.tomo-x.pushat.defs#deviceListItem",
				},
			},
			deviceListItem: {
				type: "object",
				required: ["name", "id", "current"],
				properties: {
					name: {
						type: "string",
						maxGraphemes: 30,
						maxLength: 300,
					},
					id: {
						type: "string",
						format: "tid",
					},
					current: {
						type: "boolean",
						default: false,
					},
				},
			},
		},
	},
	WinTomoXPushatDeleteDevice: {
		lexicon: 1,
		id: "win.tomo-x.pushat.deleteDevice",
		defs: {
			main: {
				type: "procedure",
				input: {
					encoding: "application/json",
					schema: {
						type: "object",
						required: ["id"],
						properties: {
							id: {
								type: "string",
								format: "tid",
							},
						},
					},
				},
				output: {
					encoding: "application/json",
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
	WinTomoXPushatGetDevices: {
		lexicon: 1,
		id: "win.tomo-x.pushat.getDevices",
		defs: {
			main: {
				type: "procedure",
				input: {
					encoding: "application/json",
					schema: {
						type: "object",
						required: ["token"],
						properties: {
							token: {
								type: "string",
							},
						},
					},
				},
				output: {
					encoding: "application/json",
					schema: {
						type: "object",
						required: ["devices", "current"],
						properties: {
							devices: {
								type: "ref",
								ref: "lex:win.tomo-x.pushat.defs#deviceList",
							},
							current: {
								type: "union",
								refs: [
									"lex:win.tomo-x.pushat.getDevices#registeredDevice",
									"lex:win.tomo-x.pushat.getDevices#unregisteredDevice",
								],
							},
						},
					},
				},
			},
			registeredDevice: {
				type: "object",
				required: ["id", "name"],
				properties: {
					id: {
						type: "string",
					},
					name: {
						type: "string",
						maxGraphemes: 30,
						maxLength: 300,
					},
				},
			},
			unregisteredDevice: {
				type: "object",
				properties: {},
			},
		},
	},
	WinTomoXPushatPushNotify: {
		lexicon: 1,
		id: "win.tomo-x.pushat.pushNotify",
		defs: {
			main: {
				type: "procedure",
				input: {
					encoding: "application/json",
					schema: {
						type: "object",
						required: ["title", "body", "icon"],
						properties: {
							title: {
								type: "string",
							},
							body: {
								type: "string",
							},
							icon: {
								type: "string",
								format: "uri",
							},
							link: {
								type: "string",
								format: "uri",
							},
						},
					},
				},
				output: {
					encoding: "application/json",
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
} as const satisfies Record<string, LexiconDoc>;
export const schemas = Object.values(schemaDict) satisfies LexiconDoc[];
export const lexicons: Lexicons = new Lexicons(schemas);

export function validate<T extends { $type: string }>(
	v: unknown,
	id: string,
	hash: string,
	requiredType: true,
): ValidationResult<T>;
export function validate<T extends { $type?: string }>(
	v: unknown,
	id: string,
	hash: string,
	requiredType?: false,
): ValidationResult<T>;
export function validate(v: unknown, id: string, hash: string, requiredType?: boolean): ValidationResult {
	return (requiredType ? is$typed : maybe$typed)(v, id, hash)
		? lexicons.validate(`${id}#${hash}`, v)
		: {
				success: false,
				error: new ValidationError(
					`Must be an object with "${hash === "main" ? id : `${id}#${hash}`}" $type property`,
				),
			};
}

export const ids = {
	WinTomoXPushatAddDevice: "win.tomo-x.pushat.addDevice",
	WinTomoXPushatDefs: "win.tomo-x.pushat.defs",
	WinTomoXPushatDeleteDevice: "win.tomo-x.pushat.deleteDevice",
	WinTomoXPushatGetDevices: "win.tomo-x.pushat.getDevices",
	WinTomoXPushatPushNotify: "win.tomo-x.pushat.pushNotify",
} as const;
