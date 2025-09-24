/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type LexiconDoc, Lexicons, ValidationError, type ValidationResult } from "@atproto/lexicon";
import { is$typed, maybe$typed } from "./util.js";

export const schemaDict = {
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
						properties: {
							title: {
								type: "string",
							},
						},
					},
				},
				output: {
					encoding: "application/json",
					schema: {
						type: "object",
						properties: {
							success: {
								type: "boolean",
							},
						},
					},
				},
			},
		},
	},
	WinTomoXPushatRegisterToken: {
		lexicon: 1,
		id: "win.tomo-x.pushat.registerToken",
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
						properties: {
							success: {
								type: "boolean",
							},
						},
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
	WinTomoXPushatPushNotify: "win.tomo-x.pushat.pushNotify",
	WinTomoXPushatRegisterToken: "win.tomo-x.pushat.registerToken",
} as const;
