import { spawnSync } from 'child_process';

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
	 * @param {string}         directory The directory we want to execute the command in.
	 * @param {string}         command   The composer command to execute.
	 * @param {Array.<string>} [params]  The parameters to pass to the composer command.
	 */
	public execute(
		directory: string,
		command: string,
		params: string[] = []
	): ComposerResult {
		try {
			const result = spawnSync(
				this.composerPath,
				[ command, ...params ],
				{
					cwd: directory,
					encoding: 'utf8',
				}
			);

			// For successful executions, all we need to do is return the output.
			if ( ! result.status && ! result.error ) {
				return { error: false, output: result.stdout };
			}

			// Clean up the output a little bit for consistency.
			let output = '';
			if ( result.stderr ) {
				output += result.stderr.trim();
			}
			if ( result.stdout ) {
				output += result.stdout.trim();
			}

			// Fall back to the error object when nothing else was given.
			if ( ! output && result.error ) {
				output += result.error.message;
			}

			return { error: true, output };
		} catch ( e ) {
			if ( e instanceof Error ) {
				return { error: true, output: e.message };
			}

			throw e;
		}
	}
}
