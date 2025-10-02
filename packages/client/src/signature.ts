export type DerivedComponents = {
	/**
	 * The HTTP request method.
	 * @see https://www.rfc-editor.org/rfc/rfc9421.html#section-2.2.1
	 * @example "GET", "POST"
	 */
	"@method": string | null;
	/**
	 * The entire target URI, including the scheme, authority, path, and query.
	 * @see https://www.rfc-editor.org/rfc/rfc9421.html#section-2.2.2
	 * @example "https://example.com/foo?bar=baz"
	 */
	"@target-uri": string | null;
	/**
	 * The authority component of the target URI.
	 * @see https://www.rfc-editor.org/rfc/rfc9421.html#section-2.2.3
	 * @example "example.com:8080"
	 */
	"@authority": string | null;
	/**
	 * The scheme component of the target URI.
	 * @see https://www.rfc-editor.org/rfc/rfc9421.html#section-2.2.4
	 * @example "https"
	 */
	"@scheme": string | null;
	/**
	 * The request target.
	 * @see https://www.rfc-editor.org/rfc/rfc9421.html#section-2.2.5
	 * @deprecated Use individual components instead, unless using HTTP/1.1.
	 */
	"@request-target": string | null;
	/**
	 * The path component of the target URI.
	 * @see https://www.rfc-editor.org/rfc/rfc9421.html#section-2.2.6
	 * @example "/foo/bar"
	 */
	"@path": string | null;
	/**
	 * The query component of the target URI.
	 * @see https://www.rfc-editor.org/rfc/rfc9421.html#section-2.2.7
	 * @example "?bar=baz&foo=qux"
	 */
	"@query": string | null;
	/**
	 * A single query parameter from the target URI. The name of the query parameter MUST be specified in the `name` key of the signature parameters.
	 * @see https://www.rfc-editor.org/rfc/rfc9421.html#section-2.2.8
	 * @example "baz"
	 */
	// "@query-param": string | null;
    /**
     * The status code for a response.
     * @see https://www.rfc-editor.org/rfc/rfc9421.html#section-2.2.9
     * @example 200
     */
    "@status":number|null;
};

/**
 * Creates the Signature Base string required for signing HTTP messages.
 * This function constructs a string from the message components that are to be signed,
 * which is then used by cryptographic functions to create the signature.
 * The process is defined in RFC 9421, Section 2.5.
 *
 * @param {string} input - The signature parameters, as defined in RFC 9421, Section 2.3.
 *   This is a string that specifies which message components are covered by the signature.
 *   This implementation does not support multiple signatures.
 *   @example `("@method" "@path" "content-digest" "content-length")`
 * @param {function(string): string | null} getHeader - A function that retrieves a header value by its name.
 *   This is used to get the values of HTTP headers that are included in the signature.
 *   @example `(name) => headers[name]`
 * @param {DerivedComponents} derivedComponents - An object containing derived components of the message, as defined in RFC 9421, Section 2.2.
 *   These are parts of the message that are not headers, such as the method, path, and authority.
 * @returns {string} The Signature Base string, which is the canonicalized representation of the signed message components.
 *   This string is what will be signed.
 * @see https://www.rfc-editor.org/rfc/rfc9421.html#section-2.5
 * @example
 * // To sign a request like:
 * // POST /foo?param=Value&Pet=dog HTTP/1.1
 * // Host: example.com
 * // Content-Type: application/json
 * // Content-Length: 18
 * // Content-Digest: sha-512=:WZ...w==:
 * //
 * // {"hello": "world"}
 *
 * const signatureMemberValue = '''("@method" "@authority" "@path" "content-digest" "content-length" "content-type");created=1618884473;keyid="did:web:example.com#hoge"''';
 * const headers = {
 *   "content-digest": "sha-512=:WZDPaVn/7XgHaAy8pmojAkGWoRx2UFChF41A2svX+TaPm+AbwAgBWnrIiYllu7BNNyealdVLvRwEmTHWXvJwew==:",
 *   "content-length": "18",
 *   "content-type": "application/json",
 * };
 * const derived = {
 *   "@method": "POST",
 *   "@authority": "example.com",
 *   "@path": "/foo",
 * };
 *
 * const signatureBase = createSigBase(
 *   signatureParams,
 *   (name) => headers[name] || null,
 *   derived
 * );
 *
 * // The resulting signatureBase will be:
 * // "@method": POST
 * // "@authority": example.com
 * // "@path": /foo
 * // "content-digest": sha-512=:WZDPaVn/7XgHaAy8pmojAkGWoRx2UFChF41A2svX+TaPm+AbwAgBWnrIiYllu7BNNyealdVLvRwEmTHWXvJwew==:
 * // "content-length": 18
 * // "content-type": application/json
 * // "@signature-params": ("@method" "@authority" "@path" "content-digest" "content-length" "content-type");created=1618884473;keyid="test-key-rsa-pss"
 */
export function createSigBase(memberValue: string, getHeader: (name: string) => string|null,derivedComponents:DerivedComponents):string {
    
}
