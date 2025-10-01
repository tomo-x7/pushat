/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type LexiconDoc, Lexicons, ValidationError, type ValidationResult } from "@atproto/lexicon";
import { is$typed, maybe$typed } from "./util.js";

export const schemaDict = {
	WinTomoXPushatClientPushNotify: {
		lexicon: 1,
		id: "win.tomo-x.pushat.client.pushNotify",
		defs: {
			main: {
				type: "procedure",
				input: {
					encoding: "application/json",
					schema: {
						type: "object",
						required: ["body", "target"],
						properties: {
							body: {
								type: "ref",
								ref: "lex:win.tomo-x.pushat.defs#notifyBody",
							},
							target: {
								type: "string",
								format: "did",
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
			notifyBody: {
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
	WinTomoXPushatClientPushNotify: "win.tomo-x.pushat.client.pushNotify",
	WinTomoXPushatDefs: "win.tomo-x.pushat.defs",
} as const;
