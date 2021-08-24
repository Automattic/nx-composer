import { readFileSync } from 'fs';

/**
 * An interface describing Composer configuration files.
 */
interface ComposerJson {
	readonly name?: string;
	readonly description?: string;
	readonly require?: { [ key: string ]: string };
	readonly 'require-dev'?: { [ key: string ]: string };
}

/**
 * A utility for manipulating Composer configuration files.
 */
export class ComposerConfig {
	/**
	 * The path to the composer.json file we're manipulating.
	 */
	private readonly filePath: string;

	/**
	 * The cached content from the composer.json file we're manipulating.
	 */
	private readonly cache?: ComposerJson;

	/**
	 * Constructor.
	 *
	 * @param {string} jsonPath The path to a composer.json file to manipulate.
	 */
	public constructor( jsonPath: string ) {
		this.filePath = jsonPath;

		const f: string = readFileSync( jsonPath, 'utf8' );
		this.cache = JSON.parse( f );
	}

	/**
	 * Gets the path to the config file.
	 */
	public getPath(): string {
		return this.filePath;
	}

	/**
	 * Gets the name of the package from the configuration.
	 */
	public getName(): string {
		if ( ! this.cache || ! this.cache.name ) {
			return '';
		}

		return this.cache.name;
	}

	/**
	 * Gets all of the packages that this one depends on.
	 *
	 * @param {boolean} [includeDev] Indicates whether or not developer dependencies should be included. Default true.
	 */
	public getDependencies( includeDev = true ): Set< string > {
		const dependencies: Set< string > = new Set();
		if ( ! this.cache ) {
			return dependencies;
		}

		// Grab all of the dependencies we've declared.
		if ( this.cache.require ) {
			for ( const req in this.cache.require ) {
				dependencies.add( req );
			}
		}
		if ( includeDev && this.cache[ 'require-dev' ] ) {
			for ( const req in this.cache[ 'require-dev' ] ) {
				dependencies.add( req );
			}
		}

		return dependencies;
	}
}
