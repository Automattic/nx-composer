import { execFileSync } from 'child_process';

/**
 * An interface for the result of a command execution.
 */
interface ComposerResult {
	readonly error: boolean;
	readonly output: string;
}

/**
 * A utility for executing Composer commands.
 */
export class ComposerRunner {
	/**
	 * The path to the composer executable.
	 */
	private readonly composerPath: string;

	/**
	 * Constructor.
	 *
	 * @param {string} composerPath The path to the composer executable.
	 */
	public constructor( composerPath: string ) {
		this.composerPath = composerPath;
	}

	/**
	 * Executes a composer command and returns the output or error.
	 *
	 * @param {string}         command  The composer command to execute.
	 * @param {Array.<string>} [params] The parameters to pass to the composer command.
	 */
	public execute( command: string, params: string[] = [] ): ComposerResult {
		try {
			const output = execFileSync(
				this.composerPath,
				[ command, ...params ],
				{
					encoding: 'utf8',
					stdio: 'ignore',
				}
			);

			return { error: false, output };
		} catch ( e ) {
			let output = '';

			if ( e && e.message ) {
				output = e.message;
			}

			return { error: true, output };
		}
	}
}
